// 抽屉平台适配器契约：核心只认这张表，platform/ 各平台文件须实现全部成员。
// 平台分叉：小程序的位移与透明度走 :style 载体，App/Web 逐帧位移不进载体、取到元素后 setProperty 直驱
import type { ComputedRef, Ref } from 'vue'

// 核心交给适配器的句柄
export type SheetHandles = {
	// 面板顶（页面内容区坐标）
	panelTop : Ref<number>
	// 面板可见高度（px）
	panelH : Ref<number>
	// 面板底部延长段的高度（px）
	reserve : Ref<number>
	// 淡入层是否在渲染
	fading : Ref<boolean>
	// 面板与淡入层的元素 id（同页多个抽屉互不相同）
	panelId : string
	fadeId : string
}

export type SheetPlatform = {
	// 模板用的两个样式载体：面板几何（安卓另带落点、小程序另带位移）、淡入层
	panelStyle : ComputedRef<any>
	fadeStyle : ComputedRef<any>
	// 面板与淡入层的元素引用，供模板绑定；不用模板 ref 的平台为 null
	panelEl : Ref<any> | null
	fadeEl : Ref<any> | null
	// 写面板位移（px，正值向下）
	move : (y : number) => void
	// 写淡入层透明度
	fade : (opacity : number) => void
	// 淡入层不再渲染：丢弃缓存的元素
	dropFadeNode : () => void
	// 面板停在静止位：位移需要落点的平台在此同步
	rest : (y : number) => void
	// 挂载时元素可能还没登记：延后按当前位移重写
	rewriteAfterMount : (rewrite : () => void) => void
}
