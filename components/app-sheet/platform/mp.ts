// 抽屉平台适配器·小程序：位移与透明度都走 :style 载体。契约见 ../sheet-platform.ts
import { computed, ref } from 'vue'
import type { SheetHandles, SheetPlatform } from '../sheet-platform'

export const createPlatform = (h : SheetHandles) : SheetPlatform => {
	// 逐帧位移载体；淡入层透明度载体
	const carrierY = ref<number>(0)
	const fadeOpacity = ref<number>(1)
	return {
		panelStyle : computed<any>(() => {
			return { top: h.panelTop.value + 'px', height: (h.panelH.value + h.reserve.value) + 'px', transform: `translate3d(0, ${carrierY.value}px, 0)` }
		}),
		fadeStyle : computed<any>(() => {
			return { opacity: fadeOpacity.value }
		}),
		panelEl : null,
		fadeEl : null,
		move : (y : number) => {
			carrierY.value = y
		},
		fade : (opacity : number) => {
			fadeOpacity.value = opacity
		},
		dropFadeNode : () => {},
		rest : (_y : number) => {},
		rewriteAfterMount : (_rewrite : () => void) => {}
	}
}
