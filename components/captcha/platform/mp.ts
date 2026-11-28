// 验证码平台适配器·小程序：滑切位移走相位 keyframes class（声明即播），不直驱、不延后挂载。契约见 ../captcha-platform.ts
import { computed } from 'vue'
import type { CaptchaHandles, CaptchaPlatform } from '../captcha-platform'

export const createPlatform = (h : CaptchaHandles) : CaptchaPlatform => {
	const { slidePhase } = h
	const slideStyleMp = computed<string>(() => {
		// out+waiting=mp-out；in+idle=mp-in（idle 须沿用 mp-in，勿翻转语义）
		if (slidePhase.value === 'out' || slidePhase.value === 'waiting') {
			return 'lh-cap-mp-out'
		}
		return 'lh-cap-mp-in'
	})

	return {
		slideStyleMp,
		slideOut : () => {},
		delaysSlideIn : () => false
	}
}
