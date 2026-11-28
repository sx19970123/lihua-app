// 遮罩平台适配器·小程序：没有 element.style，透明度走 :style 载体；原生条带、侧滑返回锁与覆盖判定都没有。契约见 ../mask-platform.ts
import { computed, ref } from 'vue'
import type { MaskHandles, MaskPlatform, MaskStrip } from '../mask-platform'

export const createPlatform = (h : MaskHandles) : MaskPlatform => {
	// 写层：小程序走 :style 载体；App/Web 载体恒为空对象，运行期的值全部 setProperty 直驱
	const carrierOpacity = ref<number>(h.progress)
	return {
		carrierStyle : computed<any>(() => {
			return { opacity: carrierOpacity.value }
		}),
		write : (p : number) => {
			carrierOpacity.value = p
		},
		syncBottom : () => {},
		buildStrips : () : MaskStrip[] => {
			const strips : MaskStrip[] = []
			return strips
		},
		lockSwipeBack : () => {},
		unlockSwipeBack : () => {},
		isCovered : () : boolean => {
			return false
		}
	}
}
