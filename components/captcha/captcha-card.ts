// 验证码·卡片开关：打开与关闭、状态复位、在途任务清理
import { nextTick } from 'vue'
import type { CaptchaContext } from './captcha-context'

export type CaptchaCard = {
	// 打开：已打开则忽略；收起键盘后渲染出起点态（浮层透明/卡片缩小），下一拍再切进场态触发过渡
	open : () => void
	// 关闭：清掉在途任务，带 id 时发 success，随后隐藏浮层并复位状态
	close : (emitId ?: string) => void
	// 关闭后把进场、滑切、数据与交互状态复位到初始值
	resetState : () => void
	// 清掉校验结果倒计时并取消在途挖矿（关闭、刷新、卸载时调）
	stopJobs : () => void
}

export const createCaptchaCard = (ctx : CaptchaContext) : CaptchaCard => {
	// 打开：已打开则忽略；收起键盘后渲染出起点态（浮层透明/卡片缩小），下一拍再切进场态触发过渡
	const open = () => {
		if (ctx.visible.value) {
			return
		}
		// uni.hideKeyboard 属内置模块 uni-keyboard：旧自定义基座未编入时抛错，此时键盘不自动收起，不阻断打开
		try {
			uni.hideKeyboard()
		} catch (err) {
			console.warn('uni.hideKeyboard 不可用：需重打含 uni-keyboard 模块的自定义基座')
		}
		ctx.visible.value = true
		nextTick(() => {
			ctx.entered.value = true
		})
		ctx.flow.getCaptcha()
	}

	const close = (emitId ?: string) => {
		stopJobs()
		if (emitId !== undefined) {
			ctx.emit('success', emitId)
		}
		ctx.visible.value = false
		resetState()
	}

	const resetState = () => {
		ctx.entered.value = false
		ctx.slidePhase.value = 'idle'
		ctx.contentAnim.value = false
		ctx.optsHold.value = false
		ctx.heightAnim.value = ''
		ctx.type.value = undefined
		ctx.captchaId.value = ''
		ctx.trackArr.value = []
		ctx.clickCount.value = 0
		ctx.dragX.value = 0
		ctx.powX.value = 0
		ctx.showResult.value = false
		ctx.verifying.value = false
		ctx.powPhase.value = 'slide'
		ctx.loadingError.value = undefined
	}

	const stopJobs = () => {
		if (ctx.verifyTimer !== undefined) {
			clearTimeout(ctx.verifyTimer)
			ctx.verifyTimer = undefined
		}
		ctx.cancelPowMining?.()
		ctx.cancelPowMining = undefined
	}

	return { open, close, resetState, stopJobs }
}
