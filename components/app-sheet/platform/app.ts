// 抽屉平台适配器·app/Web：元素 setProperty 直驱；App 取模板 ref，Web 按 id 取 DOM。契约见 ../sheet-platform.ts
import { computed, ref } from 'vue'
import type { SheetHandles, SheetPlatform } from '../sheet-platform'
import { domElementById } from '@/utils/dom'

export const createPlatform = (h : SheetHandles) : SheetPlatform => {
	// 面板与淡入层的元素引用（Web 不用，按 id 取）
	const panelEl = ref<any>(null)
	const fadeEl = ref<any>(null)
	// #ifdef APP-ANDROID
	// 载体里的位移落点：安卓的面板节点到显示时才实例化，挂载期写下的位移留不下，落点随几何一并写进载体。
	// 只收静止位；动画与拖动中的逐帧位移仍走 setProperty
	const landedY = ref<number>(0)
	// #endif
	let panelNode : any = null
	let fadeNode : any = null
	// 面板元素：App 每次取模板 ref 的当前值（挂载后引用会被重新赋值，不缓存），Web 按 id 取 DOM、首次取到后缓存
	const panelNodeOf = () : any => {
		// #ifdef APP
		panelNode = panelEl.value
		// #endif
		// #ifdef WEB
		if (panelNode == null) {
			panelNode = domElementById(h.panelId)
		}
		// #endif
		return panelNode
	}
	// 淡入层元素：随显示才创建，不显示后丢弃；取法同面板
	const fadeNodeOf = () : any => {
		// #ifdef APP
		fadeNode = fadeEl.value
		// #endif
		// #ifdef WEB
		if (fadeNode == null) {
			fadeNode = domElementById(h.fadeId)
		}
		// #endif
		return fadeNode
	}
	const panelStyle = computed<any>(() => {
		const style : any = { top: h.panelTop.value + 'px', height: (h.panelH.value + h.reserve.value) + 'px' }
		// #ifdef APP-ANDROID
		style.transform = 'translateY(' + landedY.value + 'px)'
		// #endif
		return style
	})
	return {
		panelStyle,
		fadeStyle : computed<any>(() => {
			return {}
		}),
		panelEl,
		fadeEl,
		move : (y : number) => {
			const node : any = panelNodeOf()
			if (node != null) {
				// #ifdef APP-IOS
				node.style.setProperty('transform', 'translate3d(0, ' + y + 'px, 0)')
				// #endif
				// #ifdef APP-ANDROID
				// 安卓蒸汽端不应用 translate3d，只认 2D 形式
				node.style.setProperty('transform', 'translateY(' + y + 'px)')
				// #endif
				// #ifdef WEB
				node.style.setProperty('transform', 'translate3d(0, ' + y + 'px, 0)')
				// #endif
			}
		},
		fade : (opacity : number) => {
			if (h.fading.value) {
				const node : any = fadeNodeOf()
				if (node != null) {
					node.style.setProperty('opacity', String(opacity))
				}
			}
		},
		dropFadeNode : () => {
			fadeNode = null
		},
		rest : (y : number) => {
			// #ifdef APP-ANDROID
			landedY.value = y
			// #endif
		},
		rewriteAfterMount : (rewrite : () => void) => {
			// 挂载时元素可能还没登记：按当前位移重写，取不到元素就稍后重试
			let tries = 0
			const run = () => {
				rewrite()
				if (panelNode == null && tries < 3) {
					tries++
					setTimeout(run, 32)
				}
			}
			setTimeout(run, 0)
		}
	}
}
