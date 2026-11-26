// 侧滑平台适配器·app/鸿蒙/H5：元素 setProperty 直驱 + 同步真量测；契约见 ../swipe-platform.ts
import { SIDE_L, estimateWidth } from '../swipe-platform'
import type { SwipeHandles, SwipePlatform } from '../swipe-platform'

export const createPlatform = (h : SwipeHandles) : SwipePlatform => {
	const textAt = (side : number, index : number) : any => {
		const els = side === SIDE_L ? h.textElsL.value : h.textElsR.value
		return els[index]
	}
	const labelAt = (side : number, index : number) : any => {
		const els = side === SIDE_L ? h.labelElsL.value : h.labelElsR.value
		return els[index]
	}
	const btnStyleAt = (side : number, index : number) : any => {
		const els = side === SIDE_L ? h.btnStyleL.value : h.btnStyleR.value
		return els[index]
	}
	return {
		content : (prop : string, val : string) => {
			h.contentEl.value?.style.setProperty(prop, val)
		},
		btn : (side : number, index : number, prop : string, val : string) => {
			const els = side === SIDE_L ? h.btnElsL.value : h.btnElsR.value
			els[index]?.style.setProperty(prop, val)
		},
		text : (side : number, index : number, prop : string, val : string) => {
			labelAt(side, index)?.style.setProperty(prop, val)
		},
		// 真量测，取不到（零宽/异常）回退字符估算
		textWidth : (side : number, index : number, label : string) : number => {
			try {
				const b = textAt(side, index).getBoundingClientRect()
				if (b != null && b.width > 0) {
					return b.width
				}
			} catch (e) {
			}
			return estimateWidth(label)
		},
		// 载体与元素同步置 none（重渲染按载体重贴样式，元素直写兜底）
		settle : (side : number, index : number) => {
			const st = btnStyleAt(side, index)
			if (st != null) {
				st.transform = 'none'
			}
			const els = side === SIDE_L ? h.btnElsL.value : h.btnElsR.value
			els[index]?.style.setProperty('transform', 'none')
		},
		// 触摸兜底空实现
		markConfirmBarHit : () => {},
		takeConfirmBarHit : () : boolean => {
			return false
		},
		clearConfirmBarHit : () => {},
		// 载体只供首帧藏外与底色（运行期值全走 setProperty）
		initBtnStyle : (color : string, sign : number) : any => {
			if (color !== '') {
				return { transform: `translateX(${sign * 999}px)`, backgroundColor: color }
			}
			return { transform: `translateX(${sign * 999}px)` }
		},
		initTextStyle : () : any => {
			return {}
		},
		initContentStyle : () : any => {
			return {}
		}
	}
}
