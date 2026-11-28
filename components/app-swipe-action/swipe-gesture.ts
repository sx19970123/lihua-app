// 侧滑·手势：触点跟踪、方向判定、跨域阻尼与松手选档
import { SIDE_L, SIDE_R } from './swipe-platform'
import { closeOthers, markOpen } from './mutex'
import type { SwipeContext } from './swipe-context'

export type SwipeGesture = {
	// 彩带 touchstart（模板绑定）：确认态下点中确认条时拦冒泡并置命中标记
	onBtnTouchStart : (e : any, sideId : number, index : number) => void
	// 根节点按下 / 移动（模板绑定）
	onTouchStart : (e : any) => void
	onTouchMove : (e : any) => void
	// 抬手与系统打断（模板的 touchend / touchcancel 共用）
	onTouchEnd : () => void
}

export const createSwipeGesture = (ctx : SwipeContext) : SwipeGesture => {
	// 节流：上次驱动时间戳（16ms≈一帧，同帧多次 move 只驱动末次）
	let lastDriveT = 0
	let startX = 0
	let startY = 0
	let baseX = 0
	let horizontal : boolean | null = null
	// 末速度追踪（EMA 平滑；松手前停顿>80ms 视为停住，速度作废）
	let velMs = 0
	let trackX = 0
	let trackT = 0

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

	// 彩带 touchstart：确认态下延长彩带（被点者）拦冒泡——点它=确认执行，不能被根级「触摸即退出确认」吞掉；
	// MP 上另置命中标记让根级让行（适配器兜底）
	const onBtnTouchStart = (e : any, sideId : number, index : number) => {
		if (ctx.confirming.value && ctx.confirmSide.value === sideId && ctx.confirmIndex.value === index) {
			e.stopPropagation()
			ctx.platform.markConfirmBarHit()
		}
	}

	const onTouchStart = (e : any) => {
		ctx.dragCancelled = false
		ctx.crossDamp = -1
		lastDriveT = 0
		// 点中确认条的那次触摸不归根级（MP 兜底标记，见 onBtnTouchStart）
		if (ctx.platform.takeConfirmBarHit()) {
			return
		}
		if (ctx.removing.value || ctx.props.disabled === true || ctx.props.loading === true) {
			return
		}
		ctx.motion.cancelSpringTween()
		ctx.gear.cancelInertia()
		if (ctx.confirming.value) {
			// 确认态触摸=直接关闭（微信式）：与互斥收起同款全收——彩带静态复位+行收起一段完成
			closeOthers(ctx.gear.closeSelf)
			ctx.gear.closeSelf()
			return
		}
		// 非确认态=打断场景（如退出补间进行中再触摸转拖动）→ 全量清算防中间值残留
		ctx.confirm.cancelConfirmTween()
		closeOthers(ctx.gear.closeSelf)
		const t = e.changedTouches.length > 0 ? e.changedTouches[0] : e.touches[0]
		if (t == null) {
			return
		}
		ctx.dragTouchId = t.identifier
		startX = t.screenX
		startY = t.screenY
		baseX = ctx.currentX
		horizontal = null
	}

	const onTouchMove = (e : any) => {
		const id = ctx.dragTouchId
		if (id == null || ctx.dragCancelled) {
			return
		}
		const p = findTouch(e, id)
		if (p == null) {
			return
		}
		const dx = p.screenX - startX
		const dy = p.screenY - startY
		if (horizontal == null) {
			// 方向判定：位移过 5px 才定（与轻扫展开阈值匹配），纵向意图让位滚动
			if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
				horizontal = Math.abs(dx) > Math.abs(dy)
				if (horizontal) {
					// 横滑接管：锁默认行为
					e.preventDefault()
					// 清确认文案驻留（滑出收起后文字保持确认态，按钮复见前还原）
					ctx.confirmIndex.value = -1
					// 认领互斥（markOpen 会收起持有者，含拖拽中的行→其 dragCancelled 冻结让位）
					markOpen(ctx.gear.closeSelf)
					// 起拖域门禁：开态域起拖不接盘对侧——对侧域整段阻尼
					const from = startDomain()
					ctx.crossDamp = from < 0 ? -1 : (from === SIDE_R ? SIDE_L : SIDE_R)
				}
			}
			return
		}
		if (horizontal !== true) {
			return
		}
		e.preventDefault()
		// 节流：一帧内只驱动一次
		const throttleNow = Date.now()
		if (throttleNow - lastDriveT < 16) {
			return
		}
		lastDriveT = throttleNow
		// 双向界：两域各放宽 6 倍（橡皮筋自收敛，手指无硬墙）
		ctx.currentX = ctx.motion.clamp(baseX + dx, -ctx.sides[SIDE_R].g.total * 6, ctx.sides[SIDE_L].g.total * 6)
		ctx.motion.drive(ctx.currentX)
		const now = Date.now()
		const mdt = now - trackT
		if (mdt > 0) {
			velMs = velMs * 0.7 + ((ctx.currentX - trackX) / mdt) * 0.3
		}
		trackX = ctx.currentX
		trackT = now
	}

	// 起拖域：baseX 落在哪一侧的开态域（过该侧组宽之半）；-1=收起域（total>0 守卫单侧行）
	const startDomain = () : number => {
		if (ctx.sides[SIDE_R].g.total > 0 && baseX <= -ctx.sides[SIDE_R].g.total / 2) {
			return SIDE_R
		}
		if (ctx.sides[SIDE_L].g.total > 0 && baseX >= ctx.sides[SIDE_L].g.total / 2) {
			return SIDE_L
		}
		return -1
	}

	const onTouchEnd = () => {
		ctx.platform.clearConfirmBarHit()
		if (ctx.dragTouchId == null) {
			return
		}
		ctx.dragTouchId = null
		// 跨域受阻位：压进对侧的有效位移（须在清标记前折算），0=不在受阻位
		let crossX = 0
		if ((ctx.crossDamp === SIDE_L && ctx.currentX > 0) || (ctx.crossDamp === SIDE_R && ctx.currentX < 0)) {
			crossX = ctx.motion.effOf(ctx.currentX)
		}
		ctx.crossDamp = -1
		// 被互斥打断的轮次：静默终结（不复位 horizontal 之外的任何手势态）
		if (ctx.dragCancelled) {
			ctx.dragCancelled = false
			horizontal = null
			return
		}
		if (horizontal !== true) {
			horizontal = null
			// 非横滑收尾（纵滚抢走手势/纯点按）：按阈值归位，否则停在中间态
			if (-ctx.currentX > ctx.sides[SIDE_R].g.total / 2) {
				ctx.gear.openAt(ctx.sides[SIDE_R])
			} else if (ctx.currentX > ctx.sides[SIDE_L].g.total / 2) {
				ctx.gear.openAt(ctx.sides[SIDE_L])
			} else if (Math.abs(ctx.currentX) > 0.5) {
				ctx.gear.closeSelf()
			}
			return
		}
		horizontal = null
		// 起拖域：开态域起拖只可回开本侧或收起（压向对侧的位移整段受阻尼）
		const from = startDomain()
		const fromL = from === SIDE_L
		const fromR = from === SIDE_R
		// 跨域受阻松手：自受阻位复原到收起
		if (crossX !== 0) {
			ctx.currentX = crossX
			ctx.gear.closeSelf()
			return
		}
		if (ctx.sides[SIDE_L].isSpringDirty() || ctx.sides[SIDE_R].isSpringDirty()) {
			// 弹簧回位：四元素同帧补间。
			ctx.motion.springReturn()
			return
		}
		// 分侧分向阈值：收起域起拖 5px 轻扫即开（灵敏）；开态域起拖回拖过半保持本侧开
		if (-ctx.currentX > (fromR ? ctx.sides[SIDE_R].g.total / 2 : 5)) {
			ctx.gear.openAt(ctx.sides[SIDE_R])
		} else if (ctx.currentX > (fromL ? ctx.sides[SIDE_L].g.total / 2 : 5)) {
			ctx.gear.openAt(ctx.sides[SIDE_L])
		} else {
			// 收起档：EMA 末速承接（松手前停顿则作废）
			const velocity = (Date.now() - trackT < 80) ? velMs : 0
			if (Math.abs(velocity) > 0.3) {
				ctx.gear.closeWithInertia(velocity)
			} else {
				ctx.gear.closeSelf()
			}
		}
	}
	return { onBtnTouchStart, onTouchStart, onTouchMove, onTouchEnd }
}
