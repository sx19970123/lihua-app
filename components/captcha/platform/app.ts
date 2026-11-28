// 验证码平台适配器·app/Web：滑出位移 setProperty 直驱，滑入 keyframes 由 contentAnim 延后挂载。契约见 ../captcha-platform.ts
import { computed } from 'vue'
import type { CaptchaHandles, CaptchaPlatform } from '../captcha-platform'

export const createPlatform = (h : CaptchaHandles) : CaptchaPlatform => {
	// 刷新切换相位、滑入动画放行标志、内容容器元素
	const { slidePhase, contentAnim, contentEl } = h
	const slideStyleMp = computed<string>(() => {
		// App：滑入 keyframes（from -288=静态起点）；动画 class 由 contentAnim 延后挂载；idle/滑切全程沿用不摘
		if (slidePhase.value === 'out' || slidePhase.value === 'waiting') {
			return ''
		}
		return contentAnim.value ? 'lh-cap-slide-in' : ''
	})

	return {
		slideStyleMp,
		slideOut : () => {
			// 滑出直驱（class 切换驱动的 transform 过渡在 Vapor 端跳变）
			contentEl.value?.style.setProperty('transform', 'translateX(288px)')
		},
		delaysSlideIn : () => true
	}
}
