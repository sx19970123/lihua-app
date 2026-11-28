// 遮罩平台适配器契约：核心只认这张表，platform/ 各平台文件须实现全部成员。
// 平台分叉（第 3 级，因小程序端元素引用无 .style）：写层 App/Web 走 setProperty 直驱，小程序走 :style 载体；
// 原生条带的几何、侧滑返回锁与宿主页覆盖判定只有 App 有
import type { ComputedRef, Ref } from 'vue'
import type { MaskProps } from './mask-context'

// 遮罩条带：窗口坐标系下的纵向区间（逻辑 px）
export type MaskStrip = { top : number, bottom : number }

// 核心交给适配器的句柄
export type MaskHandles = {
	props : MaskProps
	// 宿主页（App 端取内容区几何、安全区与页面样式）
	page : any
	// 页面内层的元素引用
	rootEl : Ref<any>
	// 创建时的起始进度（小程序的透明度载体取初值用，只在创建时读一次）
	progress : number
}

export type MaskPlatform = {
	// 模板用的样式载体：小程序带透明度；App/Web 恒为空对象，运行期的值全部 setProperty 直驱
	carrierStyle : ComputedRef<any>
	// 写页面内层透明度（0~1）
	write : (p : number) => void
	// 悬浮 tabBar 盖在页面内容之上、压不到它下面的层：页面内层的底边抬到 tabBar 顶，该区域改由原生条带压暗
	syncBottom : () => void
	// 原生条带范围=页面内容区之外的区域
	buildStrips : () => MaskStrip[]
	// iOS 侧滑返回不经过 onBackPress：原生层挂着期间禁掉宿主页的侧滑返回，摘掉时还原
	lockSwipeBack : () => void
	unlockSwipeBack : () => void
	// 宿主页是否已被别的页面盖住：不再是页面栈顶，或其上开了弹窗页
	isCovered : () => boolean
}
