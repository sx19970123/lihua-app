// 高度过渡平台适配器·小程序：没有 element.style，高度与过渡时长走 :style 载体；过渡交给 CSS；没有尺寸监听。契约见 ../resize-transition-platform.ts
import { computed, ref } from 'vue'
import type { ResizeTransitionContext } from '../resize-transition-context'
import type { ResizeTransitionPlatform, SizeChange, SizeWatch } from '../resize-transition-platform'

export const createPlatform = (ctx : ResizeTransitionContext) : ResizeTransitionPlatform => {
	// 写层：小程序走 :style 载体；App/Web 载体恒为空对象，高度全部 setProperty 直驱
	const carrierHeight = ref<number | null>(null)
	const carrierDuration = ref<number>(0)
	return {
		carrierStyle : computed<any>(() => {
			const h = carrierHeight.value
			const d = carrierDuration.value
			if (h == null) {
				return {}
			}
			if (d > 0) {
				return { height: `${h}px`, transitionDuration: `${d}ms` }
			}
			return { height: `${h}px` }
		}),
		boxCls : 'app-resize-transition-anim',
		jsTween : false,
		write : (height : number, duration : number) => {
			carrierHeight.value = height
			carrierDuration.value = duration
		},
		watch : (_el : any, _onChange : SizeChange) : SizeWatch | null => {
			return null
		}
	}
}
