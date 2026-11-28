// 高度过渡平台适配器·app/鸿蒙/Web：外层盒子 setProperty 直驱 + 尺寸监听；App 的高度补间由 JS 逐帧驱动，Web 交给 CSS 过渡。契约见 ../resize-transition-platform.ts
import { computed } from 'vue'
import type { ResizeTransitionContext } from '../resize-transition-context'
import type { ResizeTransitionPlatform, SizeChange, SizeWatch } from '../resize-transition-platform'

// App 的 CSS 高度过渡不生效，高度由 JS 逐帧补间
const needJsTween = () : boolean => {
	// #ifdef APP
	return true
	// #endif
	// #ifndef APP
	return false
	// #endif
}

export const createPlatform = (ctx : ResizeTransitionContext) : ResizeTransitionPlatform => {
	const jsTween = needJsTween()
	return {
		// 写层：小程序走 :style 载体；App/Web 载体恒为空对象，高度全部 setProperty 直驱
		carrierStyle : computed<any>(() => {
			return {}
		}),
		boxCls : jsTween ? '' : 'app-resize-transition-anim',
		jsTween : jsTween,
		write : (height : number, duration : number) => {
			const el : any = ctx.boxEl.value
			if (el == null) {
				return
			}
			if (duration > 0) {
				el.style.setProperty('transition-duration', `${duration}ms`)
			}
			el.style.setProperty('height', `${height}px`)
		},
		watch : (el : any, onChange : SizeChange) : SizeWatch | null => {
			// 运行时没有尺寸监听时按不支持处理
			try {
				const observer = new UniResizeObserver((entries : Array<UniResizeObserverEntry>) => {
					const rect = entries[0].contentRect
					onChange(rect.width, rect.height)
				})
				observer.observe(el as UniElement)
				return {
					stop : () => {
						observer.disconnect()
					}
				}
			} catch (e) {
				return null
			}
		}
	}
}
