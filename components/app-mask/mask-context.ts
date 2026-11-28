// 遮罩各职责模块共用的上下文：属性与事件、宿主页、响应式状态、元素引用，以及跨模块读写的普通状态。
// 模块之间不互相引用，一律经 ctx 读写；platform / native / motion 三个模块在入口组装时挂上来
import { ref } from 'vue'
import type { Ref } from 'vue'
import { hasNativeMask } from '@/uni_modules/lihua-mask'
import type { MaskMotion } from './mask-motion'
import type { MaskNative } from './mask-native'
import type { MaskPlatform } from './mask-platform'

export type MaskProps = {
	visible?: boolean
	duration?: number
	coverTabBar?: boolean
}

export type MaskEmit = {
	(e : 'click') : void
	(e : 'backpress') : void
}

export type MaskContext = {
	props : MaskProps
	emit : MaskEmit
	// 宿主页：原生条带的几何与 tabBar 避让取自其内容区位置
	page : any
	// 当前平台是否有原生遮罩层（创建时取定，之后只读）
	nativeReady : boolean
	// ---- 响应式状态 ----
	// 进度大于 0 才创建页面内层，归零即销毁（不显示时不占元素、不拦触摸）
	shown : Ref<boolean>
	// 页面内层的元素引用
	rootEl : Ref<any>
	// ---- 跨模块读写的普通状态：只能经 ctx.xxx 读写，不能解构出来 ----
	// 当前进度（0~1）与原生层挂载态：非响应式，逐帧只经写层下发
	progress : number
	nativeOn : boolean
	// 宿主页隐藏期间原生层被摘掉，回来后重挂
	nativePaused : boolean
	// 宿主页隐藏后延后一拍再判是否被盖住的定时器；null=没有
	hideTimer : number | null
	// ---- 组装时挂上的模块 ----
	platform : MaskPlatform
	native : MaskNative
	motion : MaskMotion
}

export const createMaskContext = (props : MaskProps, emit : MaskEmit, page : any) : MaskContext => {
	const nativeReady = hasNativeMask()
	return {
		props,
		emit,
		page,
		nativeReady,
		// 进度大于 0 才创建页面内层，归零即销毁（不显示时不占元素、不拦触摸）
		shown : ref<boolean>(props.visible === true),
		rootEl : ref<any>(null),
		// 当前进度（0~1）与原生层挂载态：非响应式，逐帧只经写层下发
		progress : props.visible === true ? 1 : 0,
		nativeOn : false,
		// 宿主页隐藏期间原生层被摘掉，回来后重挂
		nativePaused : false,
		hideTimer : null,
		platform : null as any as MaskPlatform,
		native : null as any as MaskNative,
		motion : null as any as MaskMotion
	}
}
