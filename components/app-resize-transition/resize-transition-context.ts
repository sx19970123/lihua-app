// 高度过渡各职责模块共用的上下文：事件、响应式状态、元素引用。
// 模块之间不互相引用，一律经 ctx 读写；platform / observe / motion 三个模块在入口组装时挂上来
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ResizeTransitionMotion } from './resize-transition-motion'
import type { ResizeTransitionObserve } from './resize-transition-observe'
import type { ResizeTransitionPlatform } from './resize-transition-platform'

// 注入键：内容在自己动高度时，经它把每一刻的高度变化量报给外层过渡（provide 的是 observe.notify）
export const RESIZE_TRANSITION_NOTIFY = 'app-resize-transition-notify'

export type ResizeTransitionEmit = {
	(e : 'resize', height : number, duration : number) : void
}

export type ResizeTransitionContext = {
	emit : ResizeTransitionEmit
	// ---- 响应式状态 ----
	// 外层盒子的元素引用（App/Web 写高度）
	boxEl : Ref<any>
	// 内容层的元素引用（量测与尺寸监听的目标）
	contentEl : Ref<any>
	// 外层盒子是否已落到量出的高度：落值之后才挂 CSS 过渡类，首次落值不播动画
	ready : Ref<boolean>
	// 是否在逐次直接落位（内容自己动高度，盒子每一拍直接落到目标、不补间）；期间不挂 CSS 过渡类
	mirroring : Ref<boolean>
	// ---- 组装时挂上的模块 ----
	platform : ResizeTransitionPlatform
	observe : ResizeTransitionObserve
	motion : ResizeTransitionMotion
}

export const createResizeTransitionContext = (emit : ResizeTransitionEmit) : ResizeTransitionContext => {
	return {
		emit,
		boxEl : ref<any>(null),
		contentEl : ref<any>(null),
		// 外层盒子是否已落到量出的高度：落值之后才挂 CSS 过渡类，首次落值不播动画
		ready : ref<boolean>(false),
		// 是否在逐次直接落位（内容自己动高度，盒子每一拍直接落到目标、不补间）；期间不挂 CSS 过渡类
		mirroring : ref<boolean>(false),
		platform : null as any as ResizeTransitionPlatform,
		observe : null as any as ResizeTransitionObserve,
		motion : null as any as ResizeTransitionMotion
	}
}
