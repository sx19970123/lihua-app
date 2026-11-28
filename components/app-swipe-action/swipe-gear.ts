// 侧滑·档位：展开/收起档位切换、惯性收起、程序化开关与行消失动画
import { createSpringControl } from '@/utils/spring'
import { clearOpen, markOpen } from './mutex'
import { SIDE_L, SIDE_R } from './swipe-platform'
import type { SwipeSide } from './swipe-side'
import type { SwipeContext } from './swipe-context'

export type SwipeGear = {
	// 惯性收起停表
	cancelInertia : () => void
	// 惯性收起：物理弹簧驱动，初速承接松手末速度
	closeWithInertia : (velocity : number) => void
	// 展开到指定实体侧（fixedSign 定 currentX 符号），另一侧彩带 p=0 自然收着
	openAt : (s : SwipeSide) => void
	// 收起本行（互斥登记、程序化 close 传的都是这个函数）
	closeSelf : () => void
	// 程序化控制：open('left'|'right')，缺省 right
	openBy : (openSide ?: string) => void
	// 行消失动画：业务完成数据准备后调此播收场动画，resolve 于播完（业务在 then 里删数据）
	remove : () => Promise<void>
}

export const createSwipeGear = (ctx : SwipeContext) : SwipeGear => {
	// 惯性收起：物理弹簧驱动，初速承接松手末速度
	const inertiaSpring = createSpringControl()
	const cancelInertia = () => { inertiaSpring.cancel() }

	const closeWithInertia = (velocity : number) => {
		cancelInertia()
		ctx.motion.cancelSpringTween()
		if (Math.abs(velocity) < 0.3) {
			closeSelf()
			return
		}
		markOpen(ctx.gear.closeSelf)
		// 全元素同弹簧：content 与两侧彩带共用同一条物理曲线
		inertiaSpring.run(ctx.currentX, 0, velocity * 1000, (x : number) => {
			ctx.currentX = x
			ctx.motion.drive(x)
		}, () => {
			ctx.currentX = 0
			clearOpen(ctx.gear.closeSelf)
			ctx.emit('close')
		})
	}

	// 展开到指定实体侧（fixedSign 定 currentX 符号），另一侧彩带 p=0 自然收着
	const openAt = (s : SwipeSide) => {
		if (ctx.props.loading === true) {
			return
		}
		// 起点归一：拖拽中的原始位移（跨域阻尼/橡皮筋段）折回有效位移，补间不从原始值起跳
		ctx.currentX = ctx.motion.effOf(ctx.currentX)
		ctx.crossDamp = -1
		// 确认形态滑出后的残留清算（此时行必为关态，界外复位不可见；含确认文案驻留）
		if (ctx.confirmResidueSide >= 0) {
			ctx.sides[ctx.confirmResidueSide].resetStatic()
			ctx.confirmResidueSide = -1
			ctx.confirmIndex.value = -1
		}
		ctx.motion.glideTo(-s.fixedSign * s.g.total)
		markOpen(ctx.gear.closeSelf)
		ctx.emit('open', s === ctx.sides[SIDE_L] ? 'left' : 'right')
	}

	const closeSelf = () => {
		if (ctx.props.loading === true) {
			return
		}
		// 起点归一：拖拽中的原始位移（跨域阻尼/橡皮筋段）折回有效位移，补间不从原始值起跳
		ctx.currentX = ctx.motion.effOf(ctx.currentX)
		ctx.crossDamp = -1
		// 拖拽中被外部（互斥）收起=打断本轮拖拽
		if (ctx.dragTouchId != null) {
			ctx.dragCancelled = true
		}
		ctx.motion.cancelSpringTween()
		cancelInertia()
		if (ctx.confirming.value) {
			// 确认态收起=保持确认形态整体滑出（不走 cancelConfirmTween）；延展宽残留挂标记，下次交互前复位
			const idx = ctx.confirmIndex.value
			const cs = ctx.sides[ctx.confirmSide.value]
			const toW = cs.g.total + ctx.confirmExtra
			ctx.confirm.cancelConfirmAnim()
			ctx.confirming.value = false
			// confirmIndex 不清：滑出期间文字保持确认文案（以二次确认形态收起），
			// 下次按钮可复见前再清（拖拽横滑判定/open 时，界外不可见）
			ctx.confirmW = -1
			ctx.confirmResidueSide = ctx.confirmSide.value
			ctx.directBusy.value = false
			ctx.directIndex.value = -1
			const fromX = ctx.currentX
			ctx.motion.springCtl.run((e : number) => {
				ctx.currentX = fromX * (1 - e)
				ctx.motion.driveContent(ctx.currentX)
				// 逐钮直写出界位，勿走 drive（会触发橡皮筋宽度写，毁确认形态）
				for (let j = 0; j < cs.g.fan.length; j++) {
					const dj = j > idx ? cs.g.fan[j] : cs.g.fan[j] * e
					cs.wBtn(j, 'transform', `translateX(${cs.fixedSign * dj}px)`)
				}
				cs.wBtn(idx, 'transform', `translateX(${cs.fixedSign * toW * e}px)`)
			})
			clearOpen(ctx.gear.closeSelf)
			ctx.emit('close')
			return
		}
		ctx.confirm.cancelConfirmTween()
		ctx.directBusy.value = false
		ctx.directIndex.value = -1
		ctx.motion.glideTo(0)
		clearOpen(ctx.gear.closeSelf)
		ctx.emit('close')
	}

	// 程序化控制：open('left'|'right')，缺省 right
	const openBy = (openSide ?: string) => {
		openAt(openSide === 'left' ? ctx.sides[SIDE_L] : ctx.sides[SIDE_R])
	}
	// 行消失动画：业务完成数据准备后调此播收场动画，resolve 于播完（业务在 then 里删数据）
	const remove = () : Promise<void> => {
		return new Promise<void>((resolve) => {
			ctx.motion.cancelSpringTween()
			cancelInertia()
			// 纯停表不清算：确认现场原样带入收场动画
			ctx.confirm.cancelConfirmAnim()
			ctx.removing.value = true
			setTimeout(() => {
				resolve()
			}, 300)
		})
	}
	return { cancelInertia, closeWithInertia, openAt, closeSelf, openBy, remove }
}
