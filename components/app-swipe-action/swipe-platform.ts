// 侧滑平台适配器契约（域根）：app-swipe-action.uvue 单核只认这张表，platform/ 各平台文件须实现
// 全部成员（漏成员编译期即红）——核心=全平台行为的交集，本契约=各平台分歧的并集
import type { Ref } from 'vue'

// 侧标识：0=左组（藏左外）/ 1=右组（藏右外）
export const SIDE_L = 0
export const SIDE_R = 1

// 字符宽估算（CJK≈1em/其余 0.55em × 字号 15——纯中文误差 ±2px，入 32px 内距后不可见）
export const estimateWidth = (label : string) : number => {
	let units = 0
	for (let i = 0; i < label.length; i++) {
		units += label.charCodeAt(i) > 255 ? 1 : 0.55
	}
	return Math.ceil(units * 15)
}

// 核心交给适配器的句柄：元素引用（app/鸿蒙/H5 写层与量测）+ 响应式 style 载体（MP 写通道），各取所需
export type SwipeHandles = {
	contentEl : Ref<any>
	btnElsL : Ref<any[]>
	btnElsR : Ref<any[]>
	textElsL : Ref<any[]>
	textElsR : Ref<any[]>
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
	// 写彩带文字属性（margin-left）
	text : (side : number, index : number, prop : string, val : string) => void
	// 文字宽（按钮量测用）
	textWidth : (side : number, index : number, label : string) => number
	// 触摸兜底：点中确认条置标 / 根触摸读并清（true=让行）/ 抬手清位——MP 上 stopPropagation
	// 不可靠时防「点确认条=取消」；app 端实证有效，空实现
	markConfirmBarHit : () => void
	takeConfirmBarHit : () => boolean
	clearConfirmBarHit : () => void
	// style 载体初始值（模板 :style 首帧）：彩带 sign=-1 左组藏左外 / 1 右组藏右外
	initBtnStyle : (color : string, sign : number) => any
	initTextStyle : () => any
	initContentStyle : () => any
}
