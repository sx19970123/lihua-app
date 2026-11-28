// 高度过渡平台适配器契约：核心只认这张表，platform/ 各平台文件须实现全部成员。
// 平台分叉（第 3 级，因小程序端元素引用无 .style、没有尺寸监听，App 端 CSS 高度过渡不生效）：
// 写层 App/Web 走 setProperty 直驱，小程序走 :style 载体；高度补间只有 App 由 JS 逐帧驱动，其余端交给 CSS 过渡；尺寸监听只有 App/Web 有
import type { ComputedRef } from 'vue'

// 尺寸监听句柄
export type SizeWatch = { stop : () => void }

// 内容层尺寸变化回调（宽、高，px）
export type SizeChange = (width : number, height : number) => void

export type ResizeTransitionPlatform = {
	// 模板用的样式载体：小程序带高度；App/Web 恒为空对象，高度全部 setProperty 直驱
	carrierStyle : ComputedRef<any>
	// 外层盒子的 CSS 过渡类：Web/小程序挂上，App 为空串
	boxCls : string
	// 高度是否由 JS 逐帧补间（App=true；false=写目标值后由 CSS 过渡播放）
	jsTween : boolean
	// 写外层盒子高度（px）。duration=这次变化的过渡时长（ms），0=直接落位；
	// App 的补间逐帧写入时恒为 0，Web/小程序带上它由样式播
	write : (height : number, duration : number) => void
	// 监视内容层尺寸变化；没有尺寸监听能力的平台返回 null
	watch : (el : any, onChange : SizeChange) => SizeWatch | null
}
