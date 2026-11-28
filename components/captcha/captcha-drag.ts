// 验证码·触摸与直驱：POW 滑动挖矿、图形拖动与点选提交、轨道滑块位移直驱
import { nextTick } from 'vue'
import { solvePow } from './pow/index'
import type { CaptchaContext } from './captcha-context'

export type CaptchaDrag = {
	// 换码后把轨道滑块与图块的直驱位移显式归位（瞬时，无动画）
	resetVisual : () => void
	// POW 轨道按下：只在待滑相位接住触点
	onPowTouchStart : (e : any) => void
	// POW 轨道移动：按触点位移驱动滑块
	onPowTouchMove : (e : any) => void
	// POW 轨道松手：拖到最右触发挖矿，否则回弹
	onPowTouchEnd : () => void
	// 系统打断：纯回弹，不触发挖矿/校验
	onPowTouchCancel : () => void
	// 图形题轨道按下：记 down 轨迹
	onDragStart : (e : any) => void
	// 图形题轨道移动：驱动滑块与图块并记 move 轨迹
	onDragMove : (e : any) => void
	// 图形题轨道松手：记 up 轨迹并提交
	onDragEnd : () => void
	// 系统打断：纯回弹，不记录 up 轨迹不提交
	onDragCancel : () => void
	// 点选：取触点坐标记 click 轨迹，点满 4 次提交
	onMaskTap : (e : any) => void
}

export const createCaptchaDrag = (ctx : CaptchaContext) : CaptchaDrag => {
	const clamp = (v : number, min : number, max : number) : number => v < min ? min : v > max ? max : v

	// 蒸汽端 :style 响应式链路逐帧更新滞后，位移经元素引用 setProperty 直驱；
	// 色带（文案层下）与圆钮容器（文案层上）同值直驱，transition 的摘除/恢复同样直驱
	// identifier 跟踪：多指下锁定拖动起始指
	let dragTouchId = -1
	const findTouchByIdentifier = (touches : any, identifier : number) : any => {
		for (let i = 0; i < touches.length; i++) {
			if (touches[i].identifier == identifier) {
				return touches[i]
			}
		}
		return null
	}

	const unitEl = () : UniElement | null => ctx.type.value === 'POW' ? ctx.powUnitEl.value : ctx.dragUnitEl.value
	const fillEl = () : UniElement | null => ctx.type.value === 'POW' ? ctx.powFillEl.value : ctx.dragFillEl.value

	// 位移 = 拖动量 - 内容宽（色带段 288 在轨道外，thumb 落位 x）；图形类拼图块联动
	const driveVisual = (x : number) => {
		const offset = `translateX(${x - ctx.CONTENT_WIDTH}px)`
		unitEl()?.style?.setProperty('transform', offset)
		fillEl()?.style?.setProperty('transform', offset)
		if (ctx.type.value === 'SLIDER') {
			ctx.sliderEl.value?.style?.setProperty('transform', `translateX(${x}px)`)
		} else if (ctx.type.value === 'ROTATE') {
			const angle = x / (ctx.DRAG_END / 360)
			ctx.sliderEl.value?.style?.setProperty('transform', `rotate(${angle}deg)`)
		} else if (ctx.type.value === 'CONCAT') {
			ctx.sliderEl.value?.style?.setProperty('transform', `translateX(${x - ctx.CONTENT_WIDTH}px)`)
		}
	}

	// 拖动开始：摘过渡（直驱，不经 class patch）
	const disableDragTransition = () => {
		unitEl()?.style?.setProperty('transition', 'none')
		fillEl()?.style?.setProperty('transition', 'none')
	}

	// 松手回弹：恢复过渡后直驱归零（连续 setProperty 按序生效）
	const springBack = () => {
		const unit = unitEl()
		if (unit) {
			unit.style.setProperty('transition', 'transform 200ms ease')
			unit.style.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
		}
		const fill = fillEl()
		if (fill) {
			fill.style.setProperty('transition', 'transform 200ms ease')
			fill.style.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
		}
		ctx.powX.value = 0
		ctx.dragX.value = 0
	}

	// 同类型刷新时轨道节点不重建，直驱位移显式归位（瞬时，无动画）
	const resetVisual = () => {
		nextTick(() => {
			ctx.powUnitEl.value?.style?.setProperty('transition', 'none')
			ctx.powUnitEl.value?.style?.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
			ctx.powFillEl.value?.style?.setProperty('transition', 'none')
			ctx.powFillEl.value?.style?.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
			ctx.dragUnitEl.value?.style?.setProperty('transition', 'none')
			ctx.dragUnitEl.value?.style?.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
			ctx.dragFillEl.value?.style?.setProperty('transition', 'none')
			ctx.dragFillEl.value?.style?.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
			if (ctx.type.value === 'ROTATE') {
				ctx.sliderEl.value?.style?.setProperty('transform', 'rotate(0deg)')
			} else if (ctx.type.value === 'CONCAT') {
				ctx.sliderEl.value?.style?.setProperty('transform', `translateX(${-ctx.CONTENT_WIDTH}px)`)
			} else {
				ctx.sliderEl.value?.style?.setProperty('transform', 'translateX(0px)')
			}
		})
	}

	let powStartX = 0
	const onPowTouchStart = (e : any) => {
		if (ctx.powPhase.value !== 'slide') {
			return
		}
		const startTouch = e.changedTouches.length > 0 ? e.changedTouches[0] : e.touches[0]
		if (startTouch == null) {
			return
		}
		ctx.dragging.value = true
		dragTouchId = startTouch.identifier
		powStartX = startTouch.screenX
		disableDragTransition()
	}
	const onPowTouchMove = (e : any) => {
		if (!ctx.dragging.value) {
			return
		}
		const p = findTouchByIdentifier(e.changedTouches, dragTouchId) ?? findTouchByIdentifier(e.touches, dragTouchId)
		if (p == null) {
			return
		}
		ctx.powX.value = clamp(p.screenX - powStartX, 0, ctx.DRAG_END)
		driveVisual(ctx.powX.value)
	}
	const onPowTouchEnd = () => {
		if (!ctx.dragging.value) {
			return
		}
		ctx.dragging.value = false
		if (ctx.powX.value >= ctx.DRAG_END) {
			startPowMining()
		} else {
			springBack()
		}
	}

	// 系统打断（来电/手势冲突）：纯回弹，不触发挖矿/校验
	const onPowTouchCancel = () => {
		if (ctx.dragging.value) {
			ctx.dragging.value = false
			springBack()
		}
	}

	// 滑到最右才触发计算（滑动为纯前端感知层，后端只校验 nonce）
	const startPowMining = async () => {
		const id = ctx.captchaId.value
		const param = ctx.powParam.value
		if (!id || !param) {
			ctx.loadingError.value = '验证码配置缺失'
			return
		}
		ctx.powPhase.value = 'mining'
		ctx.startTime.value = Date.now()
		// 挖矿超 1s 才显示进度括号（快路径零打扰）；timer 走 verifyTimer 由 stopJobs 统一清理
		ctx.verifyTimer = setTimeout(() => {
			ctx.verifyTimer = undefined
			ctx.powShowProgress.value = true
		}, 1000)
		try {
			const handle = solvePow(id, param, (solved, total) => {
				ctx.powProgress.value = Math.round(solved / total * 100)
			})
			ctx.cancelPowMining = handle.cancel
			const customData = await handle.result
			ctx.cancelPowMining = undefined
			// 快路径（<1s）时超时显示 timer 尚未触发，先清防与结果倒计时互覆
			if (ctx.verifyTimer !== undefined) {
				clearTimeout(ctx.verifyTimer)
				ctx.verifyTimer = undefined
			}
			// 空解=取消；代际不符=已刷新换码，丢弃过期解
			if (!customData || ctx.captchaId.value !== id) {
				return
			}
			ctx.stopTime.value = Date.now()
			ctx.flow.submitCaptcha(id, {
				bgImageWidth : ctx.CONTENT_WIDTH,
				bgImageHeight : ctx.IMAGE_HEIGHT,
				startTime : ctx.startTime.value,
				stopTime : ctx.stopTime.value,
				trackList : [{ x : 0, y : 0, type : '', t : 0 }],
				data : customData
			}, ctx.stopTime.value - ctx.startTime.value, true)
		} catch (err) {
			console.error(err)
			ctx.cancelPowMining = undefined
			if (ctx.captchaId.value === id) {
				ctx.flow.refresh(false)
			}
		}
	}

	let dragStartX = 0
	const onDragStart = (e : any) => {
		const startTouch = e.changedTouches.length > 0 ? e.changedTouches[0] : e.touches[0]
		if (startTouch == null) {
			return
		}
		ctx.dragging.value = true
		dragTouchId = startTouch.identifier
		dragStartX = startTouch.screenX
		disableDragTransition()
		ctx.startTime.value = Date.now()
		ctx.trackArr.value.push({ x : 0, y : 0, type : 'down', t : 0 })
	}
	const onDragMove = (e : any) => {
		if (!ctx.dragging.value) {
			return
		}
		const p = findTouchByIdentifier(e.changedTouches, dragTouchId) ?? findTouchByIdentifier(e.touches, dragTouchId)
		if (p == null) {
			return
		}
		ctx.dragX.value = clamp(p.screenX - dragStartX, 0, ctx.DRAG_END)
		driveVisual(ctx.dragX.value)
		ctx.trackArr.value.push({ x : ctx.dragX.value, y : 0, type : 'move', t : Date.now() - ctx.startTime.value })
	}
	const onDragEnd = () => {
		if (!ctx.dragging.value) {
			return
		}
		ctx.dragging.value = false
		ctx.stopTime.value = Date.now()
		ctx.trackArr.value.push({ x : ctx.dragX.value, y : 0, type : 'up', t : ctx.stopTime.value - ctx.startTime.value })
		verifyGraphic()
	}

	// 系统打断：纯回弹，不记录 up 轨迹不提交
	const onDragCancel = () => {
		if (ctx.dragging.value) {
			ctx.dragging.value = false
			springBack()
		}
	}

	// 点选：坐标换算到图片容器系（蒙层位置打开时量测）
	const onMaskTap = (e : any) => {
		e.stopPropagation()
		const point = e.changedTouches[0]
		if (!point) {
			return
		}
		if (ctx.clickCount.value === 0) {
			ctx.startTime.value = Date.now()
		}
		ctx.clickCount.value++
		if (ctx.clickCount.value > 4) {
			return
		}
		ctx.stopTime.value = Date.now()
		ctx.trackArr.value.push({
			x : Math.round(point.clientX - ctx.maskRect.left),
			y : Math.round(point.clientY - ctx.maskRect.top),
			type : 'click',
			t : ctx.stopTime.value - ctx.startTime.value
		})
		if (ctx.clickCount.value === 4) {
			verifyGraphic()
		}
	}

	const verifyGraphic = () => {
		const id = ctx.captchaId.value
		if (!id) {
			return
		}
		// 旋转以拖满量程为分母（与显示角度同坐标系），其余类型以背景宽为分母
		const bgWidth = ctx.type.value === 'ROTATE' ? ctx.DRAG_END : ctx.CONTENT_WIDTH
		ctx.flow.submitCaptcha(id, {
			bgImageWidth : bgWidth,
			bgImageHeight : ctx.IMAGE_HEIGHT,
			startTime : ctx.startTime.value,
			stopTime : ctx.stopTime.value,
			trackList : ctx.trackArr.value
		}, ctx.stopTime.value - ctx.startTime.value, false)
	}

	return { resetVisual, onPowTouchStart, onPowTouchMove, onPowTouchEnd, onPowTouchCancel, onDragStart, onDragMove, onDragEnd, onDragCancel, onMaskTap }
}
