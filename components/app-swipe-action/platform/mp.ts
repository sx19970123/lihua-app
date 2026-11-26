// 侧滑平台适配器·MP-微信：v-for 元素 ref 无 .style、无同步量测——响应式 style 载体单通道 + 字符估算 + 触摸兜底；契约见 ../swipe-platform.ts
import { SIDE_L, estimateWidth } from '../swipe-platform'
import type { SwipeHandles, SwipePlatform } from '../swipe-platform'

export const createPlatform = (h : SwipeHandles) : SwipePlatform => {
	// 确认条命中标记：点中置位→根 touchstart 消费让行→touchend/cancel 清位防脏标
	let confirmBarHit = false
	const writeContent = (prop : string, val : string) => {
		const st = h.contentStyle.value
		if (prop === 'transform') {
			st.transform = val
		}
	}
	// 显式属性赋值（不走动态键）；彩带与文字容器写入键相同（width/transform）
	const writeBox = (st : any, prop : string, val : string) => {
		if (prop === 'width') {
			st.width = val
		} else if (prop === 'transform') {
			st.transform = val
		}
	}
	return {
		content : (prop : string, val : string) => {
			writeContent(prop, val)
		},
		btn : (side : number, index : number, prop : string, val : string) => {
			const els = side === SIDE_L ? h.btnStyleL.value : h.btnStyleR.value
			const st = els[index]
			if (st != null) {
				writeBox(st, prop, val)
			}
		},
		text : (side : number, index : number, prop : string, val : string) => {
			const els = side === SIDE_L ? h.textStyleL.value : h.textStyleR.value
			const st = els[index]
			if (st != null) {
				writeBox(st, prop, val)
			}
		},
		textWidth : (_side : number, _index : number, label : string) : number => {
			return estimateWidth(label)
		},
		// 载体即样式源：置 none 即常驻
		settle : (side : number, index : number) => {
			const els = side === SIDE_L ? h.btnStyleL.value : h.btnStyleR.value
			const st = els[index]
			if (st != null) {
				writeBox(st, 'transform', 'none')
			}
		},
		markConfirmBarHit : () => {
			confirmBarHit = true
		},
		takeConfirmBarHit : () : boolean => {
			if (confirmBarHit) {
				confirmBarHit = false
				return true
			}
			return false
		},
		clearConfirmBarHit : () => {
			confirmBarHit = false
		},
		// 载体须预置全部写入键（width/transform），首帧即藏外待量测
		initBtnStyle : (color : string, sign : number) : any => {
			const st : any = { width: '', transform: `translateX(${sign * 999}px)` }
			if (color !== '') {
				st.backgroundColor = color
			}
			return st
		},
		// 载体须预置全部写入键（width/transform）
		initTextStyle : () : any => {
			return { width: '', transform: '' }
		},
		initContentStyle : () : any => {
			return { transform: '' }
		}
	}
}
