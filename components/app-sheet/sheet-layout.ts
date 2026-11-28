// 抽屉·量测布局：窗口几何、关闭位高度、头部与槽宽量测、自动高度
import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
import type { SheetContext } from './sheet-context'

// 头部各行高度（px，须与 .app-sheet-handle / .app-sheet-row 的样式同值）；量测后以量测值为准
const HANDLE_H = 48
const HEADER_H = 56
// 两槽统一的最小宽度（px）：初值取标准控件宽，量测后取两槽自然宽的较宽者（不低于标准控件宽）；标题在等宽的两槽之间居中
const SIDE_MIN = 44
// 守卫判到边的容差（px），与 app-sheet-guard.wxs 的 EDGE 同值
const GUARD_EDGE = 1

export type SheetLayout = {
	// 露头时关闭位的高度按头部形态与底部安全区取初值
	resetHeadH : () => void
	// 关闭位的露出高度随头部高度与面板高度更新；返回是否有变化
	syncClosed : () => boolean
	// 关闭位的面板位移；全开的位移恒为 0
	yClosed : () => number
	// 量窗口几何，写面板顶与面板高度；每次打开前调用
	measure : () => void
	// 内置滚动区的内容是否在顶部
	contentAtTop : () => boolean
	// 小程序端滚动守卫的回传（经 wxs 的 callMethod 调到）
	onGuardStart : (top : number) => void
	onGuardTop : () => void
	onBodyScroll : (e : any) => void
	// 标题行左右槽的最小宽度样式
	sideStyle : ComputedRef<any>
	// 量头部实高、左右槽自然宽与（自动高度时）默认插槽内容的自然高度并应用
	fitLayout : (force ?: boolean, done ?: (() => void) | null, tries ?: number) => void
	// 重新量取并应用自动高度；打开后默认插槽内容变了，由调用方在 nextTick 后调
	fit : () => void
}

export const createSheetLayout = (ctx : SheetContext) : SheetLayout => {
	// 可用高度（px）：自动高度封顶与 height 按比例换算时用
	let areaH = 1
	// 页面内容区顶（px）：面板顶让出的导航区高度，自动高度重算面板顶时用
	let insetTop = 0
	// 默认插槽内容的自然高度（px，含底部安全区）；-1=还没量到
	let contentH = -1
	const sideW = ref<number>(SIDE_MIN)

	// 页面内容区的底部安全区高度（px），与样式变量 --uni-safe-area-inset-bottom 同值
	const safeBottom = () : number => {
		// #ifdef APP
		return ctx.page?.safeAreaInsets.bottom ?? 0
		// #endif
		// #ifndef APP
		return uni.getWindowInfo().safeAreaInsets.bottom ?? 0
		// #endif
	}

	// 露头时关闭位的高度（px）=头部行高+底部安全区：初值按形态取样式常量，量测后更新
	const resetHeadH = () => {
		const rows = (ctx.showHandle.value ? HANDLE_H : 0) + (ctx.showHeader.value ? HEADER_H : 0)
		ctx.headH = Math.max(1, ctx.peek.value && rows > 0 ? rows + safeBottom() : rows)
	}

	// 关闭位的露出高度（px）：露头时为头部高度，否则为 0
	const syncClosed = () : boolean => {
		const next = ctx.peek.value ? Math.max(0, Math.min(ctx.headH, ctx.panelH.value - 1)) : 0
		if (next === ctx.closedH) {
			return false
		}
		ctx.closedH = next
		return true
	}

	// 关闭位的面板位移；全开的位移恒为 0
	const yClosed = () : number => ctx.panelH.value - ctx.closedH

	// 量几何：top=面板顶让出的高度（导航栏或状态栏），areaH=可用高度；每次打开前调用
	const measure = () => {
		const win = uni.getWindowInfo()
		let top = 0
		areaH = 1
		// #ifdef WEB
		// Web 的导航栏与 tabBar 是页内元素：top 取导航栏高度，可用高度直接取 windowHeight（已不含两者）
		top = Math.max(win.windowTop ?? 0, win.statusBarHeight ?? 0)
		areaH = Math.max(1, win.windowHeight)
		// #endif
		// #ifdef MP-WEIXIN
		// 内容区从导航栏下方起算：可用高度直接取 windowHeight
		areaH = Math.max(1, win.windowHeight)
		// #endif
		// #ifndef WEB || MP-WEIXIN
		// App：面板顶让出「状态栏高 − 内容区顶」
		const body = ctx.page?.pageBody
		const bodyTop = body == null ? 0 : body.top
		top = Math.max(0, (win.statusBarHeight ?? 0) - bodyTop)
		areaH = Math.max(1, win.windowHeight - top)
		// #endif
		insetTop = top
		const h = ctx.props.height
		// 自动高度先按内容区高度给临时几何：面板停在关闭位（屏幕外或只露头部），量定内容高度后再改
		const ph = ctx.autoFit.value ? areaH : h == null || h <= 0 ? areaH : h <= 1 ? Math.round(areaH * h) : Math.min(h, areaH)
		ctx.panelH.value = Math.max(1, ph)
		ctx.panelTop.value = insetTop + (areaH - ctx.panelH.value)
		syncClosed()
	}

	// 内置滚动区是否在顶部：内容区下拉能否带动面板的判定用
	const contentAtTop = () : boolean => {
		return ctx.atTop.value || (ctx.guardTop >= 0 && ctx.guardTop <= GUARD_EDGE)
	}

	const onGuardStart = (top : number) => {
		ctx.guardTop = top
	}

	// 守卫在顶边拦下移动：此刻内容必在顶部
	const onGuardTop = () => {
		ctx.guardTop = 0
	}

	const onBodyScroll = (e : any) => {
		const top = e.detail.scrollTop <= 0
		if (top !== ctx.atTop.value) {
			ctx.atTop.value = top
		}
		// 内容离开顶部后，本次手势早先量到的「在顶部」不再作数
		if (e.detail.scrollTop > GUARD_EDGE) {
			ctx.guardTop = -1
		}
	}

	// 应用自动高度：面板高度=头部实高+内容自然高度，封顶内容区；面板底边不动，顶边随高度上移
	const applyFitHeight = (headPx : number) => {
		const total = Math.max(1, Math.min(areaH, headPx + Math.max(0, contentH)))
		if (total === ctx.panelH.value) {
			return
		}
		ctx.panelH.value = total
		ctx.panelTop.value = insetTop + (areaH - total)
		syncClosed()
		ctx.motion.realign()
	}

	// 量头部实高、左右槽自然宽与（自动高度时）默认插槽内容的自然高度；
	// force 用于刚打开/刚挂载（此时动画可能在跑），tries 为布局未就绪时的重量次数
	const fitLayout = (force : boolean = false, done : (() => void) | null = null, tries : number = 0) : void => {
		const finish = () => {
			if (done != null) {
				done()
			}
		}
		if (!ctx.shown.value) {
			finish()
			return
		}
		if (!force && (ctx.motion.animating() || ctx.phase === 'drag')) {
			if (ctx.autoFit.value) {
				ctx.fitPending = true
			}
			return
		}
		const query = uni.createSelectorQuery().in(ctx.owner)
		if (query == null) {
			finish()
			return
		}
		query.select('.app-sheet-header').boundingClientRect()
		if (ctx.autoFit.value) {
			query.select('.app-sheet-content').boundingClientRect()
		}
		query.selectAll('.app-sheet-side-inner').boundingClientRect().exec((ret : any) => {
			const head = ret[0] as { height : number } | null
			let idx = 1
			let body : { height : number } | null = null
			if (ctx.autoFit.value) {
				body = ret[1] as { height : number } | null
				idx = 2
			}
			const rects = ret[idx] as Array<{ width : number }> | null
			// 元素还没登记或布局未就绪：稍后重量，最多三次；仍量不到就按现有几何打开，不阻断
			const hasHead = ctx.showHandle.value || ctx.showHeader.value
			const headBad = hasHead && (head == null || head.height <= 0)
			const bodyBad = ctx.autoFit.value && body == null
			if (headBad || bodyBad) {
				if (force && tries < 3) {
					setTimeout(() => {
						fitLayout(true, done, tries + 1)
					}, 32)
					return
				}
				finish()
				return
			}
			if (rects != null) {
				let w = 0
				for (let i = 0; i < rects.length; i++) {
					if (rects[i].width > w) {
						w = rects[i].width
					}
				}
				sideW.value = Math.max(SIDE_MIN, Math.ceil(w))
			}
			const rows = (ctx.showHandle.value ? HANDLE_H : 0) + (ctx.showHeader.value ? HEADER_H : 0)
			const headPx = head != null && head.height > 0 ? Math.ceil(head.height) : rows
			// 头部实高与常量不一致时，按实高修正关闭位（露头时再加底部安全区）
			let closedChanged = false
			if (ctx.peek.value && head != null && head.height > 0) {
				const real = Math.round(head.height) + safeBottom()
				if (real != ctx.headH) {
					ctx.headH = Math.max(1, real)
					closedChanged = syncClosed()
				}
			}
			if (ctx.autoFit.value && body != null) {
				contentH = Math.max(0, Math.ceil(body.height))
				applyFitHeight(headPx)
			} else if (closedChanged) {
				ctx.motion.realign()
			}
			finish()
		})
	}

	// 重新量取并应用自动高度；打开后默认插槽内容变了，由调用方在 nextTick 后调
	const fit = () => {
		if (ctx.autoFit.value && ctx.shown.value) {
			fitLayout()
		}
	}

	return {
		resetHeadH,
		syncClosed,
		yClosed,
		measure,
		contentAtTop,
		onGuardStart,
		onGuardTop,
		onBodyScroll,
		// 左右槽：最小宽度=两槽统一宽度，标题因此居中
		sideStyle : computed<any>(() => ({ minWidth: sideW.value + 'px' })),
		fitLayout,
		fit
	}
}
