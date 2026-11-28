// 验证码平台适配器契约：核心只认这张表，platform/ 各平台文件须实现全部成员。
// 平台分叉：滑切位移 App/Web 走 setProperty 直驱、滑入 keyframes 延后挂载；小程序走相位 keyframes class（声明即播）
import type { ComputedRef, Ref } from 'vue'
import type { SlidePhase } from './captcha-context'

// 核心交给适配器的句柄
export type CaptchaHandles = {
	slidePhase : Ref<SlidePhase>
	contentAnim : Ref<boolean>
	// 内容容器（pow / graphic 二选一存在）：滑出直驱用
	contentEl : Ref<any>
}

export type CaptchaPlatform = {
	// 模板绑定名不变：微信=out/waiting 给 mp-out、其余 mp-in；App/Web=out/waiting 给空串、其余按 contentAnim 给延后挂载的 lh-cap-slide-in
	slideStyleMp : ComputedRef<string>
	// 滑出直驱；小程序空实现（滑切走 keyframes class）
	slideOut : () => void
	// 滑入动画 class 是否延后挂载：App/Web 为 true，小程序为 false
	delaysSlideIn : () => boolean
}
