// 高度过渡·变化检测与量测：首次量测、尺寸监听、内容更新后重量、内容自己动高度时按变化量直接跟随；只认最新的结果
import type { ResizeTransitionContext } from './resize-transition-context'
import type { SizeChange, SizeWatch } from './resize-transition-platform'

// 内容层元素引用未就绪时的重试次数与间隔（ms）
const START_TRIES = 3
const START_DELAY = 32
// 按变化量跟随停下来之后，隔这么久真量一次对账（ms）；须大于补间模块的连续改目标间隔
const RECONCILE_DELAY = 96

export type ResizeTransitionObserve = {
	// 启动：首次量测内容高度并开始尺寸监听
	start : () => void
	// 停止：摘掉尺寸监听，在途量测作废
	stop : () => void
	// 重量内容高度（内容变化不经本组件更新时由调用方触发）
	refresh : () => void
	// 内容自己动高度时被调用：delta=它这一刻的高度变化量（px），duration=内容这段动画的时长（ms，0=这是其中一帧）
	notify : (delta : number, duration : number) => void
}

export const createResizeTransitionObserve = (ctx : ResizeTransitionContext) : ResizeTransitionObserve => {
	// 代际：尺寸监听报过或已停止后，此前发起的量测结果作废
	let epoch = 0
	let sizeWatch : SizeWatch | null = null
	let started = false
	let tries = 0
	// 量测在途标志与待量标记：在途时只记一次待量，回来后接着量
	let measuring = false
	let pending = false
	// 对账定时器；null=没有
	let reconcileTimer : number | null = null

	// 宽为 0=内容层当前没渲染（如祖先隐藏），这次结果不下发；非有限值不下发
	const apply = (width : number, height : number) => {
		if (width > 0 && isFinite(height) && height >= 0) {
			ctx.motion.resizeTo(height, true, 0)
		}
	}

	// 异步量测内容层；Async 版跨端通吃（小程序端无同步 getBoundingClientRect）
	const measure = () => {
		if (measuring) {
			pending = true
			return
		}
		const el = ctx.contentEl.value
		if (el == null) {
			return
		}
		const myEpoch = epoch
		measuring = true
		el.getBoundingClientRectAsync().then((rect : any) => {
			measuring = false
			if (myEpoch !== epoch || !started) {
				return
			}
			if (rect != null) {
				apply(rect.width as number, rect.height as number)
			}
			if (pending) {
				pending = false
				measure()
			}
		})
	}

	// 尺寸监听的结果最新：此前发起的量测作废，排队的待量也不必再量
	const onResize : SizeChange = (width : number, height : number) => {
		if (!started) {
			return
		}
		epoch++
		pending = false
		apply(width, height)
	}

	const start = () => {
		started = true
		const el = ctx.contentEl.value
		if (el == null) {
			// 元素引用尚未就绪：稍后重试，停止后不再重试
			if (tries < START_TRIES) {
				tries++
				setTimeout(() => {
					if (started) {
						start()
					}
				}, START_DELAY)
			}
			return
		}
		measure()
		sizeWatch = ctx.platform.watch(el, onResize)
	}

	const stop = () => {
		started = false
		epoch++
		pending = false
		if (reconcileTimer != null) {
			clearTimeout(reconcileTimer)
			reconcileTimer = null
		}
		if (sizeWatch != null) {
			sizeWatch.stop()
			sizeWatch = null
		}
	}

	const refresh = () => {
		if (started) {
			measure()
		}
	}

	// 内容自己动高度：盒子按变化量直接跟随；停下来后真量一次，纠正累计误差
	const notify = (delta : number, duration : number) => {
		if (!started) {
			return
		}
		if (!ctx.motion.nudge(delta, duration)) {
			// 还没量过高度，无从加起：改用量测
			measure()
			return
		}
		if (reconcileTimer != null) {
			clearTimeout(reconcileTimer)
		}
		reconcileTimer = setTimeout(() => {
			reconcileTimer = null
			measure()
		}, RECONCILE_DELAY)
	}

	return { start, stop, refresh, notify }
}
