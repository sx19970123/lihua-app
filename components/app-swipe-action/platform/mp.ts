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
	// 显式属性赋值（不走动态键）
	const writeBtn = (st : any, prop : string, val : string) => {
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
				writeBtn(st, prop, val)
			}
		},
		text : (side : number, index : number, prop : string, val : string) => {
			const els = side === SIDE_L ? h.textStyleL.value : h.textStyleR.value
			const st = els[index]
			if (st != null && prop === 'margin-left') {
				st.marginLeft = val
			}
		},
		textWidth : (_side : number, _index : number, label : string) : number => {
			return estimateWidth(label)
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
		// 载体须预置全部写入键（width/transform），首帧即藏外
		initBtnStyle : (color : string, sign : number) : any => {
			const st : any = { width: '', transform: `translateX(${sign * 999}px)` }
			if (color !== '') {
				st.backgroundColor = color
			}
			return st
		},
		initTextStyle : () : any => {
			return { marginLeft: '' }
		},
		initContentStyle : () : any => {
			return { transform: '' }
		}
	}
}
