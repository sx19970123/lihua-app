// 遮罩·进度：唯一写口（页面内层与原生层同帧下发）、线性补间、外部逐帧驱动
import { setMaskAlpha } from '@/uni_modules/lihua-mask'
import { STD_MASK_ALPHA } from '@/utils/tokens-std'
import type { MaskContext } from './mask-context'

export type MaskMotion = {
	// 线性补间到目标进度，从当前进度起算
	tweenTo : (to : number) => void
	// 外部逐帧驱动：调用后组件不再自行补间
	setProgress : (p : number) => void
	// 停掉在跑的补间
	cancelTween : () => void
}

export const createMaskMotion = (ctx : MaskContext) : MaskMotion => {
	let tweenTimer : number | null = null

	// 唯一写口：进度离开 0 即显示并挂原生层，归零即收起并摘原生层（keepOn：进度为 0 时也保持挂上）
	const apply = (p : number, keepOn : boolean = false) => {
		const v = Math.max(0, Math.min(1, p))
		ctx.progress = v
		const on = keepOn || v > 0
		if (on !== ctx.shown.value) {
			ctx.shown.value = on
		}
		ctx.platform.write(v)
		if (!ctx.nativeReady) {
			return
		}
		const wantNative = on && !ctx.nativePaused
		if (wantNative !== ctx.nativeOn) {
			ctx.nativeOn = wantNative
			if (ctx.nativeOn) {
				ctx.native.attachNative()
			} else {
				ctx.native.detachNative()
			}
		} else if (ctx.nativeOn) {
			setMaskAlpha(v * STD_MASK_ALPHA)
		}
	}

	const cancelTween = () => {
		if (tweenTimer != null) {
			clearInterval(tweenTimer)
			tweenTimer = null
		}
	}

	// 线性补间到目标进度，从当前进度起算
	const tweenTo = (to : number) => {
		cancelTween()
		// 首帧同步起跑：淡入前两层先按起点进度挂上（尚不可见），与同一拍的浮层同时就位
		if (to > 0 && ctx.progress === 0) {
			apply(0, true)
		}
		const from = ctx.progress
		const duration = ctx.props.duration ?? 200
		if (duration <= 0 || Math.abs(to - from) < 0.01) {
			apply(to)
			return
		}
		const t0 = Date.now()
		tweenTimer = setInterval(() => {
			const k = Math.min(1, (Date.now() - t0) / duration)
			apply(from + (to - from) * k)
			if (k >= 1) {
				cancelTween()
			}
		}, 16)
	}

	// 外部逐帧驱动：调用后组件不再自行补间
	const setProgress = (p : number) => {
		cancelTween()
		apply(p)
	}

	return { tweenTo, setProgress, cancelTween }
}
