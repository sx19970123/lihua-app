import { defineStore } from "pinia";
import { queryUnReadCount } from '@/api/system/notice/Notice'
/**
 * 消息通知
 */
export const useNoticeStore = defineStore('notice', {
	state: () => {
		// 未读数量
		const unreadCount: number = 0
		// 已经显示tabbar红点
		const isShowTabBarRedDot: boolean = false
		return {
			unreadCount,
			isShowTabBarRedDot
		}
	},
	actions: {
		// 获取未读数量
		getUnreadCount(): Promise<number> {
			return new Promise((resolve, reject) => {
				queryUnReadCount().then(resp => {
					if (resp.code === 200) {
						this.unreadCount = resp.data
						resolve(resp.data)
					} else {
						reject(resp.msg)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		// 处理底部导航栏红点
		setTabbarRedDot() {
			// 不存在红点，并阅读数等于0直接返回
			if (!this.isShowTabBarRedDot && this.unreadCount === 0) {
				return
			}
			// 存在红点，并未读数大于0直接返回
			if (this.isShowTabBarRedDot && this.unreadCount > 0) {
				return
			}
			// 设置红点（此api只有tabbar页面中才可设置生效，其余页面会进fail回调，切换页面时会触发根节点的onShow回调，所以处于tabbar页面总能看到新消息）
			if (this.unreadCount > 0) {
				uni.showTabBarRedDot({
					index: 1, 
					success: () => this.isShowTabBarRedDot = true,
				})
			} else {
				uni.hideTabBarRedDot({
					index: 1, 
					success: () => this.isShowTabBarRedDot = false,
				})
			}
		}
	}
})
