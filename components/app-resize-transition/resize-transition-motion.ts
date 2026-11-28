// 高度过渡·补间：把外层盒子高度过渡到目标高度。孤立的一次变化按落差定时长补间过去；
// 内容自己动高度时（经 nudge 报来每一刻的变化量）盒子逐次直接落位
import { nextTick } from 'vue'
import type { ResizeTransitionContext } from './resize-transition-context'

// 出帧间隔（ms）
const FRAME = 16
// 孤立变化的时长（ms）=时长系数×√落差(px)，钳在上下限之间：落差变为 4 倍用时才翻倍
const DURATION_K = 24
const DURATION_MIN = 140
const DURATION_MAX = 360
// 连续改目标的间隔上限（ms）：两次改目标相隔不超过它，视为内容在自己动高度
const STREAM_GAP = 48
// 在跑的补间改目标时，缓动进度超过它就重新起步（沿用原时钟的换算在此之后不稳定）
const RETARGET_LIMIT = 0.9

// 孤立变化的时长（ms）
const durationOf = (distance : number) : number => {
	return Math.round(Math.min(DURATION_MAX, Math.max(DURATION_MIN, DURATION_K * Math.sqrt(distance))))
}

export type ResizeTransitionMotion = {
	// 过渡到目标高度（px）；viaWatch=true 表示值来自尺寸监听或量测；duration>0 时用它作这次变化的时长（ms），
	// 不按落差算。目标没变时不动在跑的补间
	resizeTo : (height : number, viaWatch : boolean, duration : number) => void
	// 内容自己动高度：盒子高度加上它的变化量（px）。duration=内容这段动画的时长（ms）：0=这是内容动画的一帧，盒子直接落位；
	// 大于 0=内容一步到位、按该时长补间。返回 false=还没量过高度，无从加起
	nudge : (delta : number, duration : number) => boolean
	// 停掉在跑的补间
	cancel : () => void
}

export const createResizeTransitionMotion = (ctx : ResizeTransitionContext) : ResizeTransitionMotion => {
	let timer : number | null = null
	let gen = 0
	// 在跑补间的起点高度、起步时刻与时长（ms）
	let tweenFrom = 0
	let tweenAt = 0
	let tweenDur = DURATION_MIN
	// 外层盒子当前高度（px）；null=还没写过（盒子自然高度）
	let current : number | null = null
	// 最近一次请求的目标高度（px）；null=还没有
	let target : number | null = null
	// 最近一次改目标的时刻；null=还没有
	let lastAt : number | null = null
	// 最近一次内容报来变化量的时刻；null=还没有
	let nudgeAt : number | null = null

	const cancel = () => {
		gen++
		if (timer != null) {
			clearTimeout(timer)
			timer = null
		}
	}

	// 此刻的缓动进度（easeOutQuad，按在跑补间的时钟）
	const easedNow = () : number => {
		const k = Math.min(1, Math.max(0, (Date.now() - tweenAt) / tweenDur))
		return 1 - (1 - k) * (1 - k)
	}

	// 从起步高度补间到目标：16ms setTimeout 链；代际 token，cancel 后已入队帧不执行
	const startTween = (from : number, to : number, at : number, duration : number) => {
		cancel()
		tweenFrom = from
		tweenAt = at
		tweenDur = duration
		const myGen = gen
		const tick = () => {
			if (myGen !== gen) {
				return
			}
			const curTarget = target
			if (curTarget == null) {
				return
			}
			const k = Math.min(1, Math.max(0, (Date.now() - tweenAt) / tweenDur))
			const e = 1 - (1 - k) * (1 - k)
			const h = k < 1 ? Math.round((tweenFrom + (curTarget - tweenFrom) * e) * 100) / 100 : curTarget
			current = h
			ctx.platform.write(h, 0)
			if (k < 1) {
				timer = setTimeout(tick, FRAME)
			} else {
				timer = null
			}
		}
		tick()
	}

	// 直写：停掉补间，盒子直接落到目标。animated=true 时这次写入带过渡时长（CSS 过渡的平台上由样式播）
	const writeDirect = (next : number, animated : boolean, duration : number) => {
		cancel()
		current = next
		ctx.ready.value = true
		ctx.platform.write(next, animated ? duration : 0)
	}

	const resizeTo = (height : number, viaWatch : boolean, duration : number) => {
		const next = Math.max(0, Math.round(height * 100) / 100)
		// 目标没变：不动在跑的补间
		let changed = true
		if (target != null) {
			changed = Math.abs(next - target) >= 0.5
		}
		if (!changed) {
			return
		}
		const now = Date.now()
		// 内容刚报过变化量：监听与量测的值只可能更旧，不回退
		if (viaWatch && nudgeAt != null && now - nudgeAt < STREAM_GAP) {
			return
		}
		const streaming = lastAt != null && now - lastAt < STREAM_GAP
		lastAt = now
		target = next
		const cur = current
		const wasDirect = ctx.direct.value
		// 这次变化的时长（ms）：沿用指定值，否则按落差算；首次落值与连续改目标不补间
		let ms = 0
		if (cur != null && !streaming) {
			ms = duration > 0 ? duration : durationOf(Math.abs(next - cur))
		}
		ctx.emit('resize', next, ms)
		// 首次落值
		if (cur == null) {
			writeDirect(next, false, 0)
			return
		}
		// 连续改目标=内容在自己动：盒子直接落到目标
		if (streaming) {
			ctx.direct.value = true
			writeDirect(next, false, 0)
			return
		}
		ctx.direct.value = false
		if (ctx.platform.jsTween) {
			// 在跑的补间改目标：沿用原时钟换算起点，位置连续
			if (timer != null && Math.abs(next - cur) >= 0.5) {
				const e = easedNow()
				if (e < RETARGET_LIMIT) {
					tweenFrom = (cur - next * e) / (1 - e)
					return
				}
			}
			if (Math.abs(next - cur) < 0.5) {
				writeDirect(next, false, 0)
			} else {
				startTween(cur, next, now, ms)
			}
			return
		}
		if (wasDirect) {
			// 直接落位刚结束：等 CSS 过渡类挂回去再写，这次变化才带过渡；期间来了新目标就不写
			cancel()
			current = next
			ctx.ready.value = true
			const myGen = gen
			nextTick(() => {
				if (myGen === gen) {
					ctx.platform.write(next, ms)
				}
			})
			return
		}
		writeDirect(next, true, ms)
	}

	const nudge = (delta : number, duration : number) : boolean => {
		const base = target
		if (base == null || !isFinite(delta)) {
			return false
		}
		nudgeAt = Date.now()
		if (duration > 0) {
			resizeTo(base + delta, false, duration)
			return true
		}
		// 内容动画的一帧：直接落位
		const next = Math.max(0, Math.round((base + delta) * 100) / 100)
		lastAt = nudgeAt
		target = next
		ctx.emit('resize', next, 0)
		ctx.direct.value = true
		writeDirect(next, false, 0)
		return true
	}

	return { resizeTo, nudge, cancel }
}
