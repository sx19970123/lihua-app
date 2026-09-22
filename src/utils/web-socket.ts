import { ref } from 'vue'
import {getOnceToken} from "@/api/system/authentication/authentication";
import {getUUID} from "@/utils/uuid/uuid"
import {getClientType} from '@/utils/client'

// WebSocket 连接状态（断连重连入口的状态源）：connected=已连接；reconnecting=连接建立中/自动重连中；
// disconnected=自动重连额度耗尽已断链（仅 reconnect 耗尽分支写入），等待手动重连或重新登录
export type WsStatus = 'connected' | 'reconnecting' | 'disconnected'
export const wsStatus = ref<WsStatus>('reconnecting')

/**
 * webSocket连接具体实现逻辑
 * 
 */
class WebSocketManager {
	private webSocket?: UniNamespace.SocketTask
	// 是否在连接状态
	private isConnected: boolean
    // 事件监听器
    private listeners?: Map<string, (data: any) => void>
    // 心跳
    private heartbeat?: any
    // 重试次数
    private retryNumber: number
    // 最大重试次数
    private maxRetryNumber: number = 3
    // 重试间隔
    private retryInterval: number = 2 * 1000
    // 已排定的重连定时器（排程去重：同一轮异常多路信号只排一次）
    private reconnectTimer?: ReturnType<typeof setTimeout>
    // 是否开启重连
    private enableRetry: boolean = true

    constructor() {
        this.listeners = new Map()
        this.retryNumber = 0
		this.isConnected = false
    }

    /**
     * 建立连接
     */
    public connect = async () => {
        if (!this.webSocket) {
            // 每次显式连接重置重连开关，避免上次主动关闭（如登出）后的关闭态延续到本次连接
            this.enableRetry = true
            wsStatus.value = 'reconnecting'
			try {
				const { code, data } = await getOnceToken()

				if (code !== 200 || !data) {
					console.error("WebSocket获取连接token失败")
					this.reconnect()
					return;
				}
			
				// 拼接连接地址
				const url = import.meta.env.VITE_APP_WS_API + '?token=' + data + '&clientId=' + await getUUID() + '&clientType=' + getClientType()
			
	            // 建立连接
	            const task = this.webSocket = uni.connectSocket({
	                url,
	                success: () => console.log("WebSocket连接中"),
	                fail: (e) => {
	                    console.error("WebSocket连接失败", e)
	                    this.reconnect()
	                }
	            })

	            // 连接成功
	            task.onOpen(() => {
	                console.info('WebSocket连接成功')
	                this.retryNumber = 0
	                this.enableRetry = true
	                this.isConnected = true
	                wsStatus.value = 'connected'
	                this.startHeartbeat()
	            })

	            // 连接错误：与 onClose 走同一套清理+重连（handleAbnormalEnd 内以 task 引用去重，error+close 双触发只算一次）。
	            // 小程序 SocketTask 连接建立失败时常只触发 error 不触发 close（H5/APP 则 error 后必补 close），
	            // 原「只记录」设计在小程序端卡死：僵尸 task 残留阻塞 connect/manualReconnect，wsStatus 永停 reconnecting
	            task.onError((err) => {
	                this.isConnected = false
	                console.error('WebSocket连接错误:', err)
	                this.handleAbnormalEnd(task)
	            })

	            // 连接关闭：非 1000 关闭码视为异常断开（部分平台 event 无 code 字段，undefined 按异常处理倾向重连；主动关闭由 enableRetry=false 拦截）
	            task.onClose((event) => {
	                console.info('WebSocket连接关闭:', event)
	                this.isConnected = false
	                this.closeHeartbeat()
	                // task 引用去重：error 分支已清理过（this.webSocket 已换防/置空）则跳过，防双触发重复重连
	                if (this.webSocket !== task) {
	                    return
	                }
	                this.webSocket = undefined
	                if (event?.code !== 1000 && this.enableRetry) {
	                    this.reconnect()
	                }
	            })

	            // 接收消息
	            task.onMessage((res) => {
	                this.receiveMessage(res)
	            })
			} catch (e) {
				console.error("websocket连接失败",e)
				this.reconnect()
			}
		} else {
			console.log("当前websocket实例已存在")
		}
    }
	
	// 注册事件
	public addEventListener = (type: string, callback: (data: any) => void) => {
	    if (!this.listeners) {
	        this.listeners = new Map()
	    }
	    this.listeners.set(type, callback);
	}
	
	// 删除事件
	public removeEventListener = (type: string) => {
	    this.listeners?.delete(type)
	}
	
	// 发送数据
	public sendMessage = (type: string, data: any): Promise<boolean> => {
	    return new Promise((resolve, reject) => {
			if (!this.isReady()) {
			    console.warn("WebSocket 未连接，消息发送失败")
			    return resolve(false)
			}
			try {
			    const json = JSON.stringify({type, data, timestamp: new Date().getTime()})
			    uni.sendSocketMessage({
			    	data: json,
					success: () => resolve(true),
					fail: (error) => {
						console.error("WebSocket消息发送失败", error);
						resolve(false)
					}
			    })
			} catch (error) {
				reject(error)
			    console.error("WebSocket消息发送失败，无法处理的消息格式", error);
			}
		})
	}
	
	// 手动重连：清零重试计数重启新一轮自动重连；自动重连耗尽停止后的外部恢复通道，由 UI 层显式调用
	public manualReconnect = () => {
		if (this.webSocket) {
			// 僵尸 task 兜底：连接失败态的 task（小程序 error 无 close 场景）会永久占位阻塞重连，强制清理后重启；
			// close 后补发的 onClose 经 task 引用去重跳过
			this.webSocket.close({code: 1000})
			this.webSocket = undefined
			this.closeHeartbeat()
		}
		this.enableRetry = true
		this.retryNumber = 0
		this.connect()
	}

	// 主动关闭连接
	public closeConnect = () => {
		console.log("WebSocket主动关闭")
	    this.enableRetry = false
	    // 主动关闭后清零重试计数，下次连接从满额度开始
	    this.retryNumber = 0
		// 撤销排定中的自动重连（enableRetry 已拦截执行，此处同步收回定时器与状态）
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = undefined
		}
		this.webSocket?.close({code: 1000})
		this.webSocket = undefined
	}

    // 异常终止统一处理：清理 task 与心跳后走重连（onError 入口；onClose 里 task 引用比对去重后走同款逻辑）
    private handleAbnormalEnd = (task: UniNamespace.SocketTask) => {
        if (this.webSocket !== task) {
            return
        }
        this.isConnected = false
        this.webSocket = undefined
        this.closeHeartbeat()
        if (this.enableRetry) {
            this.reconnect()
        }
    }

    // 重试连接：固定间隔；累计 maxRetryNumber 次仍未连上则停止自动重连，等待下次登录触发
    private reconnect = () => {
        if (this.retryNumber >= this.maxRetryNumber) {
            wsStatus.value = 'disconnected'
            console.warn("WebSocket 重连失败已达上限，停止自动重连")
            return
        }
		this.webSocket = undefined
        // 排程去重：同一轮异常的 fail/error/close 多路信号只计一次数、排一次定时器（enableRetry=false 拦截执行）
        if (this.reconnectTimer) {
            return
        }
        this.retryNumber ++
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = undefined
            // 等待期间被主动关闭（如登出）则不再重连
            if (!this.enableRetry) {
                return
            }
            console.log("websocket 执行第" + this.retryNumber + "次重连")
            this.connect()
        }, this.retryInterval)
    }

    // 接收数据
    private receiveMessage = (event: UniNamespace.OnSocketMessageCallbackResult) => {
        const data = event.data
        if (typeof data === "string") {
            try {
                // json转换为对象
                const webSocketMessage: WebSocketMessage = JSON.parse(data)
                // 从注册的事件中拿到对象
                const listener = this.listeners?.get(webSocketMessage.type)
                if (listener) {
                    listener(webSocketMessage.data)
                }
            } catch (error) {
                console.error("WebSocket消息处理失败，无法处理的消息格式", error);
            }
        } else {
            // 非文本消息
            console.error("WebSocket消息处理失败，无法处理的消息格式");
        }
    }

    // 开启心跳
    private startHeartbeat = () => {
        this.closeHeartbeat()
        this.heartbeat = setInterval(() => {
            if (this.isReady()) {
                this.sendMessage("WS_HEARTBEAT", "ping")
            }
        }, 1000 * 30)
    }

    // 关闭心跳
    private closeHeartbeat = () => {
        if (this.heartbeat) {
            clearInterval(this.heartbeat);
        }

        this.heartbeat = undefined
    }

    // websocket 是否准备就绪
    private isReady = (): boolean => {
        return this.isConnected;
    }
}

/**
 * WebSocket 接收消息类型
 */
interface WebSocketMessage {
    type: string;
    data: string;
    timestamp: number;
}

export const webSocket = new WebSocketManager()
