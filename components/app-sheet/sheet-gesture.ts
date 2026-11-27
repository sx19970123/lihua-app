// 抽屉·手势：触点跟踪与速度采样、拖动仲裁、松手选目标
import { rubber } from '@/utils/damping'
import type { SheetContext } from './sheet-context'

// 松手后展开还是收起：速度超过 FLING_V（px/ms）顺速度方向，否则取离得近的一端；松手前超过 V_STALE（ms）没有移动视为停住
const FLING_V = 0.4
const V_STALE = 100
// 速度采样的最大间隔（ms）：与上一采样相隔更久（按住停顿）时上一采样不作数
const V_GAP = 40
// 头部带动面板的起拖阈值（px）：纵向位移超过它才算拖动
const CLAIM_SLOP = 3
// 内容区带动面板的锁定阈值（px）：内容在顶部时下拉超过它才接管，接管点之前的位移不带动面板
const LOCK = 8
// 点击容差（px）：带动面板后位移仍在容差内且不算快甩的，按点击处理
const TAP_SLOP = 8

export type SheetGesture = {
	onTouchStart : (e : any) => void
	onTouchMove : (e : any) => void
	onTouchEnd : (e : any) => void
	// 系统打断（来电等）：回到当前目标
	onTouchCancel : () => void
	// 头部、把手自身的 touchstart 先于面板触发，用它们标记触点起点
	onHeaderTouchStart : () => void
	onHandleTouchStart : () => void
}

export const createSheetGesture = (ctx : SheetContext) : SheetGesture => {
	let startY = 0
	let baseY = 0
	// 起拖时的露出高度：松手时据此判断这次触摸有没有真的拖动面板
	let baseH = 0
	// 起拖时面板是否停在关闭位
	let fromClosed = false
	let fromHeader = false
	let fromHandle = false
	let headerTouched = false
	let handleTouched = false
	// 松手速度：按下起全程统计，取最近两段位移的平均速度（px/ms，正值向下），用来选目标与回位
	let carryMs = 0
	let trackY = 0
	let trackT = 0
	let prevY = 0
	let prevT = 0
	// 内容在顶部时手指的位置：内容区的下拉从这里起算；-1=内容不在顶部
	let topX = 0
	let topY = -1

	// 事件时刻（ms）。小程序端逻辑层的触摸事件成批送达：按处理时刻取时间会把一批事件算成同一时刻，松手速度丢失，
	// 改用事件自带的时间戳；其余端沿用处理时刻
	const stampOf = (e : any) : number => {
		// #ifdef MP-WEIXIN
		return typeof e.timeStamp === 'number' && e.timeStamp > 0 ? e.timeStamp : Date.now()
		// #endif
		// #ifndef MP-WEIXIN
		return Date.now()
		// #endif
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

	// 速度采样：取最近两段位移的平均速度（px/ms，正值向下）；同一时刻的多次移动并作一次。
	// limit=采样间隔上限（ms）：相隔更久（按住停顿）时速度记 0
	const sample = (p : any, now : number, limit : number = V_GAP) => {
		if (now == trackT) {
			trackY = p.screenY
			return
		}
		const dt = now - trackT
		const inst = dt <= limit ? (p.screenY - trackY) / dt : 0
		carryMs = prevT > 0 && now - prevT <= limit ? (p.screenY - prevY) / (now - prevT) : inst
		prevY = trackY
		prevT = trackT
		trackY = p.screenY
		trackT = now
	}

	const onHeaderTouchStart = () => {
		headerTouched = true
	}

	const onHandleTouchStart = () => {
		handleTouched = true
	}

	// 松手后展开还是收起。v=松手速度（px/ms，正值向下）
	const pickOpen = (v : number) : boolean => {
		// 到头拖动的越界段：回到被越过的那一端
		if (ctx.sheetY <= 0) {
			return true
		}
		const bottom = ctx.layout.yClosed()
		if (ctx.sheetY >= bottom) {
			return false
		}
		// 快甩：顺速度方向
		if (Math.abs(v) > FLING_V) {
			return v < 0
		}
		// 其余：离得近的一端
		const h = ctx.panelH.value - ctx.sheetY
		return h - ctx.closedH > ctx.panelH.value - h
	}

	// 带动面板：冻结在途动画，冻结位即起拖基准，此后面板位移=手指相对 originY 的位移
	const claim = (originY : number) => {
		ctx.motion.stopAnims()
		baseY = ctx.sheetY
		baseH = ctx.panelH.value - baseY
		fromClosed = ctx.phase === 'closed'
		startY = originY
		prevT = 0
		ctx.phase = 'drag'
		ctx.mode = 'sheet'
	}

	const onTouchStart = (e : any) => {
		fromHeader = headerTouched
		fromHandle = handleTouched
		headerTouched = false
		handleTouched = false
		// 露头模式面板常驻，收起过程中也能接住；其余情况的关闭位与收起过程中不接触摸
		if (ctx.dragTouchId != null || (ctx.phase === 'leave' && !ctx.peek.value) || (ctx.phase === 'closed' && !ctx.peek.value)) {
			return
		}
		// 进场中触摸：面板先落到关闭位，这次触摸按停在关闭位处理
		if (ctx.motion.animating() && ctx.phase === 'closed') {
			ctx.motion.stopAnims()
			ctx.motion.writeY(ctx.layout.yClosed())
		}
		const t = e.changedTouches.length > 0 ? e.changedTouches[0] : e.touches[0]
		if (t == null) {
			return
		}
		ctx.dragTouchId = t.identifier
		startY = t.screenY
		fromClosed = ctx.phase === 'closed'
		topX = t.screenX
		// 新手势开始：上一次手势的守卫回传作废（本次的回传晚于按下事件到达）
		ctx.guardTop = -1
		topY = ctx.layout.contentAtTop() ? t.screenY : -1
		trackY = t.screenY
		trackT = stampOf(e)
		carryMs = 0
		prevT = 0
		ctx.mode = 'none'
	}

	const onTouchMove = (e : any) => {
		const id = ctx.dragTouchId
		if (id == null) {
			return
		}
		const p = findTouch(e, id)
		if (p == null) {
			return
		}
		// #ifdef MP-WEIXIN
		// 带动面板之前的移动也采样：逻辑层收到的移动事件少，一甩可能只有一两个样本
		sample(p, stampOf(e))
		// #endif
		if (ctx.mode === 'none') {
			if (!ctx.canDrag.value) {
				return
			}
			if (fromHeader) {
				// 头部：纵向位移超过起拖阈值就带动，位移从按下点起算
				if (Math.abs(p.screenY - startY) < CLAIM_SLOP) {
					return
				}
				claim(startY)
			} else {
				// 内容区：须为内置滚动、允许内容带动，且内容在顶部（不在顶部时交给原生滚动）。
				// 以内容在顶部时的手指位置为基准，下拉超过锁定阈值且纵向为主才接管；接管点之前的位移不带动面板
				if (ctx.isBare.value || ctx.props.closeOnContentDrag !== true || !ctx.layout.contentAtTop()) {
					topY = -1
					return
				}
				if (topY < 0) {
					topX = p.screenX
					topY = p.screenY
				}
				const pull = p.screenY - topY
				if (pull < LOCK || pull <= Math.abs(p.screenX - topX)) {
					return
				}
				claim(topY + LOCK)
			}
		}
		// 抽屉拖动全程拦截默认行为：内容滚动区不参与这次手势
		e.preventDefault()
		const top = 0
		const bottom = ctx.layout.yClosed()
		const raw = baseY + (p.screenY - startY)
		let y = raw
		if (!ctx.peek.value) {
			y = Math.max(top, Math.min(bottom, raw))
		} else if (raw < top) {
			y = top - rubber(top - raw, Math.min(ctx.reserve.value, ctx.panelTop.value))
		} else if (raw > bottom) {
			y = bottom + rubber(raw - bottom, ctx.reserve.value)
		}
		ctx.motion.writeY(y)
		sample(p, stampOf(e))
	}

	const onTouchEnd = (e : any) => {
		headerTouched = false
		handleTouched = false
		if (ctx.dragTouchId == null) {
			return
		}
		// #ifdef MP-WEIXIN
		// 松手事件带着手指的最后位置，补一次采样：最后一段位移可能没有单独的移动事件。
		// 逻辑层收到的移动事件稀疏，这段的间隔上限放宽到 V_STALE
		const last = findTouch(e, ctx.dragTouchId)
		if (last != null) {
			sample(last, stampOf(e), V_STALE)
		}
		// #endif
		ctx.dragTouchId = null
		const wasSheet = ctx.mode === 'sheet'
		ctx.mode = 'none'
		const v = (stampOf(e) - trackT < V_STALE) ? carryMs : 0
		// 没带动面板，或带动后位移仍在点击容差内且不算快甩：这次触摸是点击
		const still = !wasSheet || (Math.abs(ctx.panelH.value - ctx.sheetY - baseH) < TAP_SLOP && Math.abs(v) <= FLING_V)
		// 停在关闭位时点击把手展开（没有把手时点标题行）
		if (still && fromClosed && (fromHandle || (!ctx.showHandle.value && fromHeader))) {
			if (wasSheet) {
				ctx.motion.writeY(ctx.layout.yClosed())
				ctx.phase = 'closed'
			}
			ctx.motion.open()
			return
		}
		if (!wasSheet) {
			return
		}
		// 点击：回当前目标；拖动：按松手位置与速度选展开或收起，带速度松手由弹簧承接
		ctx.motion.setOpened(still ? ctx.opened.value : pickOpen(v))
		ctx.motion.slideTo(ctx.opened.value, false, still ? 0 : v, !still)
	}

	// 系统打断（来电等）：回到当前目标
	const onTouchCancel = () => {
		headerTouched = false
		handleTouched = false
		if (ctx.dragTouchId == null) {
			return
		}
		ctx.dragTouchId = null
		if (ctx.mode === 'sheet') {
			ctx.mode = 'none'
			ctx.motion.slideTo(ctx.opened.value)
		}
		ctx.mode = 'none'
	}

	return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onHeaderTouchStart, onHandleTouchStart }
}
