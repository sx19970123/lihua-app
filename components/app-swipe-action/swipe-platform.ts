// 侧滑平台适配器契约：app-swipe-action.uvue 只认这张表，platform/ 各平台文件须实现全部成员
import type { Ref } from 'vue'

// 侧标识：0=左组（前缘=行左缘）/ 1=右组（前缘=行右缘）
export const SIDE_L = 0
export const SIDE_R = 1

// 字符宽估算（CJK≈1em / 其余 0.55em × 字号 15）
export const estimateWidth = (label : string) : number => {
	let units = 0
	for (let i = 0; i < label.length; i++) {
		units += label.charCodeAt(i) > 255 ? 1 : 0.55
	}
	return Math.ceil(units * 15)
}

// 核心交给适配器的句柄：元素引用（app/鸿蒙/H5；textEls=文字量测，labelEls=文字容器写层）+ 响应式 style 载体（MP）
export type SwipeHandles = {
	contentEl : Ref<any>
	btnElsL : Ref<any[]>
	btnElsR : Ref<any[]>
	textElsL : Ref<any[]>
	textElsR : Ref<any[]>
	labelElsL : Ref<any[]>
	labelElsR : Ref<any[]>
	btnStyleL : Ref<any[]>
	btnStyleR : Ref<any[]>
	textStyleL : Ref<any[]>
	textStyleR : Ref<any[]>
	contentStyle : Ref<any>
}

export type SwipePlatform = {
	// 写内容层属性（transform）
	content : (prop : string, val : string) => void
	// 写彩带属性（width / transform）
	btn : (side : number, index : number, prop : string, val : string) => void
	// 写彩带文字容器属性（width / transform）
	text : (side : number, index : number, prop : string, val : string) => void
	// 文字宽（按钮量测用）
	textWidth : (side : number, index : number, label : string) => number
	// 触摸兜底：点中确认条置标 / 根触摸读并清（true=让行）/ 抬手清位；app 端空实现
	markConfirmBarHit : () => void
	takeConfirmBarHit : () => boolean
	clearConfirmBarHit : () => void
	// 首帧藏外位移退场（量测后调）：常驻值 none 须落进声明式载体——只命令式清会被重渲染按载体打回
	settle : (side : number, index : number) => void
	// style 载体初始值（模板 :style 首帧）：彩带首帧藏行外待量测，sign=-1 左组 / 1 右组
	initBtnStyle : (color : string, sign : number) => any
	// 文字容器载体须预置全部写入键（width / transform）
	initTextStyle : () => any
	initContentStyle : () => any
}
