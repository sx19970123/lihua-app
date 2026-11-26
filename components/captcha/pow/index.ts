/**
 * POW 工作量证明求解调度：分片挖矿走 lihua-pow 插件（App 原生 / Web wasm / 微信纯 JS，插件内部自决）
 * 返回带 cancel 的句柄：取消后引擎立即停止，result 以空串收场
 */
import { mineSlice, mineSliceAsync, prepareEngine } from '@/uni_modules/lihua-pow'
import { prngHex } from './sha256'

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
	let finish !: (value : string) => void
	const result = new Promise<string>(resolve => {
		finish = resolve
	})
	const cancel = () => {
		cancelled = true
		finish('')
	}

	const run = async () => {
		const report = () => onProgress?.(solved, num)
		// 引擎准备：App=原生恒就绪；Web/微信=插件内部回退纯 JS
		await prepareEngine()

		// 分片挖矿：App 走后台线程，片完回调续下一片，主线程不被占（转圈动画流畅）；
		// Web/微信在主线程分片，每片先让出再算（调度优先 MessageChannel，iOS 对 setTimeout 有节流）
		await new Promise<void>(resolveItem => {
			let cursor = 0
			let nonce = 0
			const SLICE_TRIES = 50000
			const channel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : undefined
			let schedule : () => void
			if (channel) {
				channel.port1.onmessage = () => sliceSync()
				schedule = () => channel.port2.postMessage(0)
			} else {
				schedule = () => setTimeout(sliceSync, 0)
			}
			// 一片的结果：命中记解并换下一题，未命中续下一片
			const onSliced = (found : number) => {
				if (cancelled) {
					return
				}
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
				step()
			}
			const step = () => {
				const challenge = challenges[cursor]
				// 平台不支持后台挖矿：让出主线程后同步算一片
				if (!mineSliceAsync(challenge.saltHex, challenge.targetHex, nonce, SLICE_TRIES, onSliced)) {
					schedule()
				}
			}
			const sliceSync = () => {
				if (cancelled) {
					return
				}
				const challenge = challenges[cursor]
				onSliced(mineSlice(challenge.saltHex, challenge.targetHex, nonce, SLICE_TRIES))
			}
			step()
		})
		if (!cancelled) {
			finish(solutions.join('-'))
		}
	}
	run()

	return { result, cancel }
}
