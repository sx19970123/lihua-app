// 抽屉·运动：面板位移的唯一写口、帧循环与弹簧、相位状态机、开合与回位
import { nextTick } from 'vue'
import { createSpringControl } from '@/utils/spring'
import type { SheetContext } from './sheet-context'

// 帧间隔（ms）
const FRAME_MS = 16
// 入场时长（ms）：非露头模式从关闭位滑到展开位，行程较短时等比缩短（下限四分之一）；露头面板进场固定用全长
const ENTER_MS = 360
// 到位判定：距目标的位移不超过该值（px）视为已到达
const SETTLE_X = 0.5
// 内容淡入：超出关闭位的露出高度到达全开的该比例时内容完全显示
const FADE_AT = 0.85
// 松手回位照搬侧滑：带速度松手（速度超过 SPRING_V，px/ms）走物理弹簧，停顿后松手走缓出补间；程序开合沿用浮动面板曲线。
// 补间与程序开合时长同为 PANEL_MS（ms）
const SPRING_V = 0.3
const PANEL_MS = 300
const PANEL_AX = 0.22
const PANEL_AY = 0.8
const PANEL_BX = 0.28
const PANEL_BY = 1

export type SheetMotion = {
	// 唯一写口：面板位移、遮罩进度与内容淡入层透明度同帧下发
	writeY : (y : number) => void
	// 是否有动画在跑（补间、进场或弹簧）
	animating : () => boolean
	stopAnims : () => void
	// 面板走到展开位或关闭位；enter=非露头模式从关闭位的入场；v=松手速度（px/ms，正值向下）；handOff=手指松手
	slideTo : (open : boolean, enter ?: boolean, v ?: number, handOff ?: boolean) => void
	// 露头面板进场：整块面板从屏幕外升到关闭位
	slideIn : () => void
	// 关闭位变化后重新对位
	realign : () => void
	// 切换目标并通知外部；返回是否有变化
	setOpened : (next : boolean) => boolean
	// 展开到全开；从关闭位展开时按入场处理
	open : () => void
	// 收起到关闭位
	close : () => void
}

export const createSheetMotion = (ctx : SheetContext) : SheetMotion => {
	let animTimer : number | null = null
	// 松手回位的物理弹簧：与侧滑惯性收起同一引擎、同一参数，初速承接松手末速度；springing=弹簧在跑
	const settleSpring = createSpringControl()
	let springing = false

	// 是否有动画在跑（补间、进场或弹簧）
	const animating = () : boolean => animTimer != null || springing

	// 唯一写口：面板位移、遮罩进度（=关闭位到展开位之间的展开比例）与内容淡入层透明度同帧下发
	const writeY = (y : number) => {
		ctx.sheetY = y
		ctx.platform.move(y)
		// 静止位才把位移交给平台落点：此刻既没有动画在跑，也不在拖动中
		if (!animating() && ctx.mode !== 'sheet') {
			ctx.platform.rest(y)
		}
		const beyond = ctx.panelH.value - y - ctx.closedH
		const span = ctx.panelH.value - ctx.closedH
		const p = span > 0 ? Math.max(0, Math.min(1, beyond / span)) : 1
		ctx.maskEl.value?.setProgress(p)
		// 淡入层：超出关闭位的露出高度到达全开的 FADE_AT 倍时透明度归零，之后不再渲染。
		// 露头模式停在关闭位时内容区就露出一截，不盖
		const cover = ctx.peek.value || span <= 0 ? 0 : 1 - Math.min(1, beyond / (span * FADE_AT))
		ctx.fading.value = cover > 0
		ctx.platform.fade(cover)
	}

	const stopAnims = () => {
		settleSpring.cancel()
		springing = false
		if (animTimer != null) {
			clearInterval(animTimer)
			animTimer = null
		}
	}

	// 帧循环：各段动画共用一个定时器，每帧送入自首帧起流逝的毫秒数（首帧记 FRAME_MS）
	const startFrames = (frame : (ms : number) => void) => {
		stopAnims()
		let t0 = -1
		animTimer = setInterval(() => {
			const now = Date.now()
			if (t0 < 0) {
				t0 = now - FRAME_MS
			}
			frame(now - t0)
		}, FRAME_MS)
	}

	// 缓动曲线 cubic-bezier(ax, ay, bx, by)：入参为时间比例，返回走过的行程比例。
	// 贝塞尔的横坐标不是时间：先用牛顿迭代由横坐标反解参数，再取纵坐标
	const ease = (x : number, ax : number, ay : number, bx : number, by : number) : number => {
		let t = x
		for (let i = 0; i < 4; i++) {
			const o = 1 - t
			const cx = 3 * o * o * t * ax + 3 * o * t * t * bx + t * t * t - x
			const dx = 3 * o * o * ax + 6 * o * t * (bx - ax) + 3 * t * t * (1 - bx)
			if (dx == 0) {
				break
			}
			t = t - cx / dx
		}
		t = Math.max(0, Math.min(1, t))
		const o = 1 - t
		return 3 * o * o * t * ay + 3 * o * t * t * by + t * t * t
	}

	// 停顿后松手的补间（侧滑同款缓出）：入参为时间比例，返回剩余行程比例
	const tweenRest = (x : number) : number => (1 - x) * (1 - x)

	// 入场曲线：速度线性升到峰值后按平方衰减；入参为时间比例，返回剩余行程比例
	const enterRest = (x : number) : number => (1 - x) * (1 - x) * (1 - x) * (1 + 3 * x)

	// 是否正从关闭位展开 / 正收回关闭位（到位时发 open / close）
	let pendingOpen = false
	let pendingClose = false

	// 到达展开位
	const finishOpen = () => {
		ctx.phase = 'open'
		// 动画期间的内容变化收尾后补量
		if (ctx.fitPending) {
			ctx.fitPending = false
			ctx.layout.fitLayout()
		}
		if (pendingOpen) {
			pendingOpen = false
			ctx.emit('open')
		}
	}

	// 到达关闭位并通知外部；露头模式面板常驻
	const finishClose = () => {
		writeY(ctx.layout.yClosed())
		pendingOpen = false
		ctx.phase = 'closed'
		if (!ctx.peek.value) {
			ctx.fading.value = false
			ctx.shown.value = false
			// 面板已隐藏：按住未松的触摸不再带动面板
			ctx.dragTouchId = null
			ctx.mode = 'none'
		}
		// 动画期间的内容变化收尾后补量；收起后隐藏的面板不量
		if (ctx.fitPending) {
			ctx.fitPending = false
			if (ctx.peek.value) {
				ctx.layout.fitLayout()
			}
		}
		if (pendingClose) {
			pendingClose = false
			ctx.emit('close')
		}
	}

	// 物理弹簧走到 to：v0=初速（px/s）。面板越过展开位的量不超过延长段（否则底部露空）；终帧落到位再收尾
	const springTo = (to : number, v0 : number, done : () => void) => {
		stopAnims()
		springing = true
		const cap = -ctx.reserve.value
		settleSpring.run(ctx.sheetY, to, v0, (x : number) => {
			writeY(x < cap ? cap : x)
		}, () => {
			springing = false
			writeY(to)
			done()
		})
	}

	// 面板走到展开位或关闭位。带速度松手走物理弹簧，停顿后松手走缓出补间（回位照搬侧滑）；
	// 程序开合（按钮、外部改 visible、点按回到当前目标）走浮动面板曲线。
	// enter=非露头模式从关闭位的入场，走入场曲线（行程越短越快，下限 ENTER_MS/4）。已在目标则直接收尾
	const slideTo = (open : boolean, enter : boolean = false, v : number = 0, handOff : boolean = false) => {
		stopAnims()
		const to = open ? 0 : ctx.layout.yClosed()
		const from = ctx.sheetY
		if (!open) {
			ctx.phase = 'leave'
			// 已在关闭位或更靠下（拖出屏外）直接收尾
			if (from >= to - SETTLE_X) {
				finishClose()
				return
			}
		} else {
			ctx.phase = enter ? 'enter' : 'settle'
			if (Math.abs(from - to) <= SETTLE_X) {
				writeY(to)
				finishOpen()
				return
			}
		}
		const done = () => {
			if (open) {
				finishOpen()
			} else {
				finishClose()
			}
		}
		if (enter && !ctx.peek.value) {
			const ms = Math.max(ENTER_MS / 4, ENTER_MS * Math.abs(from - to) / ctx.panelH.value)
			startFrames((t : number) => {
				const x = Math.min(1, t / ms)
				if (x >= 1) {
					stopAnims()
					writeY(to)
					done()
					return
				}
				writeY(to + (from - to) * enterRest(x))
			})
			return
		}
		if (handOff && Math.abs(v) > SPRING_V) {
			springTo(to, v * 1000, done)
			return
		}
		startFrames((t : number) => {
			const x = Math.min(1, t / PANEL_MS)
			if (x >= 1) {
				stopAnims()
				writeY(to)
				done()
				return
			}
			writeY(to + (from - to) * (handOff ? tweenRest(x) : 1 - ease(x, PANEL_AX, PANEL_AY, PANEL_BX, PANEL_BY)))
		})
	}

	// 露头面板进场：整块面板从屏幕外升到关闭位，走入场曲线、时长用全长；期间仍是关闭态
	const slideIn = () => {
		const from = ctx.sheetY
		const to = ctx.layout.yClosed()
		if (from <= to) {
			writeY(to)
			return
		}
		startFrames((t : number) => {
			const x = Math.min(1, t / ENTER_MS)
			if (x >= 1) {
				stopAnims()
				writeY(to)
				return
			}
			writeY(to + (from - to) * enterRest(x))
		})
	}

	// 关闭位变化后重新对位：静止的直接落到当前目标，运动中的从当前位置重走
	const realign = () => {
		if (ctx.phase === 'closed') {
			// 关闭位恒为 yClosed（含自动高度量取中：此时 opened 已置真，但面板仍在关闭位等入场）
			if (!animating()) {
				writeY(ctx.layout.yClosed())
			} else {
				// 进场中：从当前位置改指向新的关闭位
				slideIn()
			}
		} else if (ctx.phase === 'open') {
			writeY(0)
		} else if (ctx.phase === 'enter' || ctx.phase === 'settle' || ctx.phase === 'leave') {
			slideTo(ctx.opened.value)
		}
	}

	// 切换目标并通知外部；返回是否有变化
	const setOpened = (next : boolean) : boolean => {
		if (next === ctx.opened.value) {
			return false
		}
		const wasClosed = !ctx.opened.value
		ctx.opened.value = next
		if (wasClosed) {
			pendingOpen = true
			if (ctx.props.visible !== true) {
				ctx.emit('update:visible', true)
			}
		} else {
			pendingClose = true
			ctx.emit('update:visible', false)
		}
		return true
	}

	// 展开到全开；从关闭位展开时按入场处理
	const open = () => {
		if (ctx.phase === 'drag') {
			return
		}
		// 自动高度量取中：本次打开已受理，等量完再入场
		if (ctx.opened.value && ctx.phase === 'closed') {
			return
		}
		const enter = ctx.phase === 'closed'
		if (enter) {
			ctx.layout.measure()
			writeY(ctx.layout.yClosed())
			ctx.mounted.value = true
			ctx.shown.value = true
		}
		if (ctx.phase === 'open' && ctx.opened.value) {
			return
		}
		setOpened(true)
		if (enter) {
			if (ctx.autoFit.value) {
				// 先量内容再入场：面板此时停在关闭位，量定高度后从这里展开
				nextTick(() => {
					ctx.layout.fitLayout(true, () => {
						if (!ctx.opened.value || !ctx.shown.value) {
							return
						}
						writeY(ctx.layout.yClosed())
						slideTo(true, true)
					})
				})
				return
			}
			nextTick(() => {
				ctx.layout.fitLayout(true)
			})
			slideTo(true, true)
			return
		}
		slideTo(true, false)
	}

	// 收起到关闭位
	const close = () => {
		if (!ctx.opened.value && (ctx.phase === 'closed' || ctx.phase === 'leave')) {
			return
		}
		// 拖动中被外部收起：先结束这次拖动
		if (ctx.phase === 'drag') {
			ctx.dragTouchId = null
			ctx.mode = 'none'
		}
		setOpened(false)
		slideTo(false)
	}

	return { writeY, animating, stopAnims, slideTo, slideIn, realign, setOpened, open, close }
}
