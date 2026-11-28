// 侧滑·确认链：按钮点击、进确认补间、确认执行、停表与打断清算
import { nextTick } from 'vue'
import { createSpringControl } from '@/utils/spring'
import { SIDE_L, SIDE_R, estimateWidth } from './swipe-platform'
import type { SwipeAction, SwipeContext } from './swipe-context'
import type { SwipeSide } from './swipe-side'

// 确认链弹簧（进度域 0→1）：k=冲刺速度；每次过冲按行程归一（弹幅 6px）
const CONFIRM_K = 350

export type SwipeConfirm = {
	// 确认动画停表统一口（弹簧与归心补间两源齐停）
	cancelConfirmAnim : () => void
	// 打断清算：停表 + 双侧静态复位瞬设
	cancelConfirmTween : () => void
	// 按钮点击（模板绑定）：非 confirm 型直接回传，confirm 型先进确认态
	onActionClick : (action : SwipeAction, sideId : number, index : number) => void
}

export const createSwipeConfirm = (ctx : SwipeContext) : SwipeConfirm => {
	let confirmAction : SwipeAction | null = null
	const confirmSpring = createSpringControl(CONFIRM_K, 28, 0.008, 0.3)
	// 确认动画停表统一口（弹簧与归心补间两源齐停）
	const cancelConfirmAnim = () => {
		confirmSpring.cancel()
		ctx.motion.confirmCtl.cancel()
	}

	const cancelConfirmTween = () => {
		cancelConfirmAnim()
		// 打断清算：双侧静态复位瞬设；confirmW 由起点兜底重取
		ctx.sides[SIDE_L].resetStatic()
		ctx.sides[SIDE_R].resetStatic()
		ctx.confirmW = -1
	}

	// toX 传 null = 不驱动 content（item 冻结）；j>idx 按钮（在被点钮上层）随进度滑出藏外
	const confirmTweenDrive = (s : SwipeSide, index : number, toW : number, toX : number | null, toM : number) => {
		// 只清旧动画不清算（纯停表）——起步前的清旧 ≠ 打断清算（见 cancelConfirmTween 注释）
		cancelConfirmAnim()
		const fromW = ctx.confirmW >= 0 ? ctx.confirmW : s.g.fan[index]
		const fromX = ctx.currentX
		const fromM = ctx.confirmM
		const n = s.g.fan.length
		const settled = Math.abs(toW - fromW) < 0.5 && Math.abs(toM - fromM) < 0.5
			&& (toX == null || Math.abs(toX - fromX) < 0.5)
		if (settled) {
			return
		}
			// 过冲幅度归一（每钮阻尼比）：目标 6px÷行程，封顶 12%
			const range = Math.abs(toW - fromW)
			const ratio = Math.min(0.12, 6 / Math.max(range, 1))
			const lzi = Math.log(1 / ratio)
			const cRun = 2 * Math.sqrt(CONFIRM_K) * lzi / Math.sqrt(Math.PI * Math.PI + lzi * lzi)
			confirmSpring.run(0, 1, 0, (e : number) => {
				ctx.confirmW = ctx.motion.safe(fromW + (toW - fromW) * e, toW)
				ctx.confirmM = ctx.motion.safe(fromM + (toM - fromM) * e, toM)
				s.wBtn(index, 'width', `${ctx.confirmW}px`)
				if (toX != null) {
					ctx.currentX = ctx.motion.safe(fromX + (toX - fromX) * e, toX)
					ctx.motion.driveContent(ctx.currentX)
				}
				s.wText(index, 'margin-left', `${ctx.confirmM}px`)
				for (let j = index + 1; j < n; j++) {
					const d = ctx.motion.safe(s.g.fan[j] * e, s.g.fan[j])
					s.wBtn(j, 'transform', `translateX(${s.fixedSign * d}px)`)
				}
			}, null, cRun)
	}

	// 进确认：从按钮态延长到对接 item（extra=装不下时 item 顶开量）；入口把 currentX 归一 -W
	const confirmExtend = (s : SwipeSide, index : number, tw : number, extra : number) => {
		// 掐行运动补间（开行 glide 可能在途）
		ctx.motion.cancelSpringTween()
		s.clearSpringDirty()
		ctx.confirmW = s.g.fan[index]
		ctx.confirmM = s.g.margins[index] ?? 0
		const toW = s.g.total + extra
		const openX = -s.fixedSign * s.g.total
		if (ctx.currentX !== openX) {
			ctx.currentX = openX
			ctx.motion.driveContent(ctx.currentX)
		}
		ctx.confirmExtra = extra
		confirmTweenDrive(s, index, toW, extra > 0 ? -s.fixedSign * toW : null, Math.max(0, (toW - tw) / 2))
	}

	// 确认态下延长彩带盖住全场（唯一可点=它自己）：再点=确认执行
	const onActionClick = (action : SwipeAction, sideId : number, index : number) => {
		if (ctx.props.loading === true) {
			return
		}
		if (ctx.confirming.value) {
			onConfirmExecute()
			return
		}
		if (action.confirm === true) {
			// 进确认态：被点彩带延至对接 item（装不下时 item 顺势顶开），文字切为确认文案并平移到彩带中心
			ctx.confirming.value = true
			ctx.confirmIndex.value = index
			ctx.confirmSide.value = sideId
			ctx.directBusy.value = false
			confirmAction = action
			ctx.confirmLabel.value = action.confirmText ?? '确认操作？'
			// 确认文案宽走字符估算（量测须等渲染线程重排，老安卓上排队几十 ms）；补间同步启动
			const s = ctx.sides[sideId]
			const tw = estimateWidth(ctx.confirmLabel.value)
			const extra = ctx.motion.safe(Math.max(0, tw + 24 + ctx.SPIN_PAD - s.g.total), 0)
			confirmExtend(s, index, tw, extra)
		} else {
			// 直点：记录钮位——handler 同步置 loading 则冻结展开档（spinner 钮上归心），
			// 未置则 nextTick 乐观即收（一帧差不可察）
			ctx.directSide.value = sideId
			ctx.directIndex.value = index
			ctx.directBusy.value = true
			ctx.emit('action', action)
			nextTick(() => {
				if (ctx.props.loading !== true) {
					ctx.gear.closeSelf()
				}
			})
		}
	}

	// 确认执行：回传 @action 并冻结确认现场；同步完成（未置 loading）时 nextTick 自动收起
	const onConfirmExecute = () => {
		const act = confirmAction
		confirmAction = null
		ctx.motion.cancelSpringTween()
		ctx.gear.cancelInertia()
		cancelConfirmAnim()
		if (act != null) {
			ctx.emit('action', act)
		}
		nextTick(() => {
			if (ctx.props.loading !== true && ctx.confirming.value) {
				ctx.gear.closeSelf()
			}
		})
	}
	return { cancelConfirmAnim, cancelConfirmTween, onActionClick }
}
