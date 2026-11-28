// 分段器·手势：方向判定、滑块拖动、速度采样、松手选段与到位轻震
import { damp } from '@/utils/damping'
import { haptic } from '@/utils/haptic'
import type { SegmentedContext } from './segmented-context'

// 拖过尽头时越界量的阻尼
const OVER_DRAG = 0.3

export type SegmentedGesture = {
	onTouchStart : (e : any) => void
	onTouchMove : (e : any) => void
	// 松手与系统打断同走这里
	onTouchEnd : () => void
}

export const createSegmentedGesture = (ctx : SegmentedContext) : SegmentedGesture => {
	let startX = 0
	let startY = 0
	let lockX = 0
	let baseX = 0
	let horizontal : boolean | null = null
	let onThumb = true
	// fling 末速度追踪（EMA 平滑；松手前停顿>80ms 视为有意停住，速度作废）
	let velMs = 0
	let trackX = 0
	let trackT = 0

	// 到位轻震：滑块最近段每变一下；松手目标不同于已震位置再补一下（fling 越段）。点选不震
	let tickIndex = -1
	const tick = () : void => {
		haptic('light')
	}

	const findTouch = (e : any, id : number) : any => {
		for (let i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier === id) {
				return e.changedTouches[i]
			}
		}
		for (let i = 0; i < e.touches.length; i++) {
			if (e.touches[i].identifier === id) {
				return e.touches[i]
			}
		}
		return null
	}

	// 松手目标段回避禁用段：按与落点距离向外扫描最近可用段
	const resolveTarget = (target : number) : number => {
		const arr = ctx.items.value
		for (let d = 0; d < arr.length; d++) {
			const lo = target - d
			if (lo >= 0 && lo < arr.length && !arr[lo].disabled) {
				return lo
			}
			const hi = target + d
			if (d > 0 && hi >= 0 && hi < arr.length && !arr[hi].disabled) {
				return hi
			}
		}
		return ctx.index.value
	}

	const clampIndex = (i : number) : number => {
		const n = ctx.items.value.length
		return Math.max(0, Math.min(n - 1, i))
	}

	// 按下不冻结动画：确认是拖动滑块（见 onTouchMove 的方向判定）才冻结，轻点/纵滚时动画照常走完
	const onTouchStart = (e : any) => {
		if (ctx.isDisabledAll.value || ctx.items.value.length < 2) {
			return
		}
		const t = e.changedTouches.length > 0 ? e.changedTouches[0] : e.touches[0]
		if (t == null) {
			return
		}
		ctx.dragTouchId = t.identifier
		startX = t.screenX
		startY = t.screenY
		horizontal = null
		velMs = 0
		trackT = Date.now()
		// 触点落在滑块上（左右各放宽 4px）才可拖动；位置未知时不限制
		const x0 = ctx.motion.visualX()
		if (ctx.segW.value <= 0 || !(ctx.groupLeft >= 0)) {
			onThumb = true
		} else {
			onThumb = t.clientX >= ctx.groupLeft + x0 - 4 && t.clientX <= ctx.groupLeft + x0 + ctx.segW.value + 4
		}
		tickIndex = ctx.segW.value > 0 ? Math.round(Math.max(0, Math.min((ctx.items.value.length - 1) * ctx.segW.value, x0)) / ctx.segW.value) : ctx.index.value
		ctx.layout.measure()
	}

	const onTouchMove = (e : any) => {
		const id = ctx.dragTouchId
		if (id == null || ctx.segW.value <= 0) {
			return
		}
		const p = findTouch(e, id)
		if (p == null) {
			return
		}
		if (horizontal == null) {
			const dx = p.screenX - startX
			const dy = p.screenY - startY
			// 位移过 5px 才定方向，纵向意图让位页面滚动
			if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
				ctx.pressIdx.value = -1
				horizontal = Math.abs(dx) > Math.abs(dy) && onThumb
				if (horizontal) {
					e.preventDefault()
					// 锁定拖动这一刻才冻结动画，冻结位即起拖点
					ctx.springCtl.cancel()
					const cur = ctx.motion.visualX()
					ctx.animX.value = null
					ctx.dragX.value = cur
					baseX = cur
					trackX = cur
					trackT = Date.now()
					lockX = p.screenX
				}
			}
			return
		}
		if (horizontal !== true) {
			return
		}
		e.preventDefault()
		const maxX = (ctx.items.value.length - 1) * ctx.segW.value
		const raw = baseX + (p.screenX - lockX)
		// 拖过尽头：越界量按阻尼计入，渲染时转成滑块压缩
		const x = raw > maxX ? maxX + damp(raw - maxX, OVER_DRAG) : (raw < 0 ? damp(raw, OVER_DRAG) : raw)
		ctx.dragX.value = x
		// 末速度 EMA（px/ms）
		const now = Date.now()
		const dt = now - trackT
		if (dt > 0) {
			velMs = velMs * 0.7 + ((x - trackX) / dt) * 0.3
		}
		trackX = x
		trackT = now
		// 到位轻震（排在最后：震动异常不影响手势）
		const near = Math.round(Math.max(0, Math.min(maxX, x)) / ctx.segW.value)
		if (near !== tickIndex) {
			tickIndex = near
			tick()
		}
	}

	const onTouchEnd = () => {
		ctx.pressIdx.value = -1
		if (ctx.dragTouchId == null) {
			return
		}
		ctx.dragTouchId = null
		// 未成拖动（轻点/纵向让位/没按在滑块上）：动画没停过，无需复位
		if (horizontal !== true) {
			horizontal = null
			return
		}
		horizontal = null
		if (ctx.segW.value <= 0) {
			return
		}
		const cur = ctx.dragX.value != null ? ctx.dragX.value : ctx.index.value * ctx.segW.value
		// fling：末速够猛→目标至少推进到方向上的下一分界（快甩飞段）；否则落最近段
		const vel = (Date.now() - trackT < 80) ? velMs : 0
		let idx : number
		if (Math.abs(vel) > 0.5) {
			const pos = cur / ctx.segW.value
			idx = clampIndex(vel > 0 ? Math.ceil(pos + 0.001) : Math.floor(pos - 0.001))
		} else {
			idx = clampIndex(Math.round(cur / ctx.segW.value))
		}
		const target = resolveTarget(idx)
		ctx.motion.commit(target, vel * 1000)
		if (target !== tickIndex) {
			tickIndex = target
			tick()
		}
	}
	return { onTouchStart, onTouchMove, onTouchEnd }
}
