/**
 * POW 工作量证明求解调度：iOS App 走 WASM 加速分片（wasm 吞吐不依赖 JS JIT），
 * 其余端纯 JS 快路径分片；微信小程序优先 wx worker 串行
 * 返回带 cancel 的句柄：取消后引擎立即停止，result 以空串收场
 */
import { mineSlice, prngHex } from "./sha256"
// #ifdef APP-PLUS
import { initWasmMiner, mineSliceWasm } from "./wasm-miner"
// #endif

// 挖矿进度回调
type PowProgress = (solved : number, total : number) => void

// 单个挑战参数（salt/target 由主线程按后端同款算法派生）
type PowChallenge = {
	index : number,
	saltHex : string,
	targetHex : string
}

// 求解句柄：result 为解串（nonce 以 "-" 连接），取消后以空串 resolve
type PowHandle = {
	result : Promise<string>,
	cancel : () => void
}

/**
 * 求解 POW
 * @param token 验证码 id
 * @param powParam POW 参数 [difficulty, saltLen, num]
 */
export const solvePow = (token : string, powParam : number[], onProgress ?: PowProgress) : PowHandle => {
	const [difficulty, saltLen, num] = powParam
	// 与后端 CapPowVerifier 同款派生：salt=prng(token+(i+1))、target=prng(token+(i+1)+"d")
	const challenges : PowChallenge[] = Array.from({ length: num }, (_, i) => ({
		index: i,
		saltHex: prngHex(`${token}${i + 1}`, saltLen),
		targetHex: prngHex(`${token}${i + 1}d`, difficulty)
	}))

	const solutions : number[] = new Array(num)
	let solved = 0
	let cancelled = false
	// 引擎注册的即时停止动作（terminate worker / 停止分片调度）
	let stopEngine : () => void = () => {}
	let finish !: (value : string) => void
	const result = new Promise<string>(resolve => {
		finish = resolve
	})
	const cancel = () => {
		cancelled = true
		stopEngine()
		finish('')
	}

	const run = async () => {
		const report = () => onProgress?.(solved, num)

		// 分片挖矿引擎：默认纯 JS 快路径（安卓 V8 实测 0.几秒）
		let mine = mineSlice
		// #ifdef APP-PLUS
		// iOS App 端 webview 的 JS JIT 受基座配置影响（实测 dev 基座仅 4 万次/秒，均值 6.5s）；
		// wasm 吞吐不依赖 JS JIT，iOS 恒走 wasm（不做运行时基准：iOS 无 performance 全局且
		// 短基准与长跑表现倒挂）；wasm 加载失败回退纯 JS
		try {
			if (uni.getSystemInfoSync().platform === 'ios') {
				await initWasmMiner()
				mine = mineSliceWasm
			}
		} catch (e) {
			console.warn('POW WASM 不可用，回退纯 JS 分片', e)
		}
		// #endif

		// #ifdef MP-WEIXIN
		// 微信小程序：仅支持单个 worker，串行求解；不可用时回退纯 JS 分片
		const wxApi = globalThis as { wx ?: { createWorker ?: (path : string) => { onMessage : (cb : (msg : { index : number, nonce : number }) => void) => void, postMessage : (msg : PowChallenge) => void, terminate : () => void } } }
		const wxWorker = wxApi.wx?.createWorker?.('static/workers/index.js')
		if (wxWorker) {
			try {
				await new Promise<void>(resolveItem => {
					let cursor = 0
					wxWorker.onMessage(({ nonce }) => {
						if (cancelled) {
							return
						}
						solutions[cursor] = nonce
						solved++
						report()
						cursor++
						if (cursor < challenges.length) {
							wxWorker.postMessage(challenges[cursor])
						} else {
							wxWorker.terminate()
							resolveItem()
						}
					})
					stopEngine = () => {
						wxWorker.terminate()
						resolveItem()
					}
					wxWorker.postMessage(challenges[0])
				})
				if (!cancelled) {
					finish(solutions.join('-'))
				}
				return
			} catch (e) {
				console.warn('POW 微信 worker 异常，回退主线程分片', e)
			}
		}
		// #endif

		// 主线程分片挖矿：每片限量让出主线程，进度实时可见。
		// 调度优先 MessageChannel：iOS 对 setTimeout 有节流（低电量模式可达 1s/次），
		// MessageChannel 走任务队列不受节流（React 调度器同款）
		await new Promise<void>(resolveItem => {
			let cursor = 0
			let nonce = 0
			const SLICE_TRIES = 50000
			const channel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : undefined
			let schedule : () => void
			if (channel) {
				channel.port1.onmessage = () => slice()
				schedule = () => channel.port2.postMessage(0)
			} else {
				schedule = () => setTimeout(slice, 0)
			}
			stopEngine = () => resolveItem()
			const slice = () => {
				if (cancelled) {
					return
				}
				const challenge = challenges[cursor]
				const found = mine(challenge.saltHex, challenge.targetHex, nonce, SLICE_TRIES)
				if (found >= 0) {
					solutions[cursor] = found
					solved++
					report()
					cursor++
					if (cursor >= challenges.length) {
						resolveItem()
						return
					}
					nonce = 0
				} else {
					nonce += SLICE_TRIES
				}
				schedule()
			}
			slice()
		})
		if (!cancelled) {
			finish(solutions.join('-'))
		}
	}
	run()

	return { result, cancel }
}
