// 抽屉各职责模块共用的上下文：属性与事件、响应式状态、宿主实例、平台写层，以及跨模块读写的普通状态。
// 模块之间不互相引用，一律经 ctx 读写；platform / layout / motion / gesture 四个模块在入口组装时挂上来
import { computed, ref, useSlots } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { SheetGesture } from './sheet-gesture'
import type { SheetLayout } from './sheet-layout'
import type { SheetMotion } from './sheet-motion'
import type { SheetPlatform } from './sheet-platform'
import { getUUID } from '@/utils/uuid'

export type SheetProps = {
	visible?: boolean
	closable?: boolean
	draggable?: boolean
	closeOnContentDrag?: boolean
	height?: number
	autoHeight?: boolean
	peek?: boolean
	head?: string
}

export type SheetEmit = {
	(e : 'update:visible', value : boolean) : void
	(e : 'open') : void
	(e : 'close') : void
}

// closed 停在关闭位 / enter 展开中（外部触发） / open 停在展开位 / drag 拖动中 / settle 回位中 / leave 收起中
export type SheetPhase = 'closed' | 'enter' | 'open' | 'drag' | 'settle' | 'leave'

// 面板底部的延长段（px）：露头模式到头拖动的橡皮筋渐近幅度；拖动或弹簧过冲使面板向上越界时由它补位，底部不留空
export const OVER_MAX = 40

export type SheetContext = {
	props : SheetProps
	emit : SheetEmit
	// 宿主页（App 端用于取内容区几何与安全区）与组件实例（量测用）
	page : any
	owner : any
	// ---- 响应式状态 ----
	// 裸内容模式：调用方自带滚动容器
	isBare : ComputedRef<boolean>
	// 自动高度：按默认插槽内容的自然高度定面板高度（忽略 height）；裸内容由调用方定高，不参与
	autoFit : ComputedRef<boolean>
	// 可拖动：closable 为 false 时恒不可拖
	canDrag : ComputedRef<boolean>
	// 露头模式：关闭位露出头部
	peek : ComputedRef<boolean>
	// 头部形态：把手行 / 标题行是否显示
	showHandle : ComputedRef<boolean>
	showHeader : ComputedRef<boolean>
	// 遮罩组件
	maskEl : Ref<any>
	// 面板几何（页面内容区坐标）：panelTop=面板顶；panelH=面板可见高度（关闭位的位移量）；
	// 面板实际高度多出 reserve：向上越界时面板抬起，多出的这截从屏幕底补进来
	panelTop : Ref<number>
	panelH : Ref<number>
	reserve : Ref<number>
	// 当前目标：true=全开，false=关闭位
	opened : Ref<boolean>
	shown : Ref<boolean>
	mounted : Ref<boolean>
	// 内容淡入层是否渲染
	fading : Ref<boolean>
	// 内置滚动区是否在顶部
	atTop : Ref<boolean>
	// 面板与淡入层的元素 id（同页多个抽屉互不相同）
	panelId : string
	fadeId : string
	// ---- 跨模块读写的普通状态：只能经 ctx.xxx 读写，不能解构出来 ----
	phase : SheetPhase
	// 当前面板位移（px）；全开为 0
	sheetY : number
	// none=还没带动面板 / sheet=抽屉拖动中
	mode : 'none' | 'sheet'
	// 当前跟踪的触点标识；null=没有。标识由系统分配、可为任意整数（iOS Safari 为负数），不能拿具体数值表示「没有」
	dragTouchId : number | null
	// 露头时关闭位的高度（px）=头部行高+底部安全区：初值按形态取样式常量，量测后更新
	headH : number
	// 关闭位的露出高度（px）：露头时为头部高度，否则为 0
	closedH : number
	// 动画/拖动中收到的内容变化：收尾后再补量
	fitPending : boolean
	// 小程序端滚动守卫的回传（经 wxs 的 callMethod 调到；其余端没有守卫，恒为 -1）：本次手势按下时量到的内容位置。
	// 内容是否在顶部除滚动事件外另以它为准：滚动事件成批节流，到顶后的最后一条可能送不到逻辑层
	guardTop : number
	// ---- 组装时挂上的模块 ----
	platform : SheetPlatform
	layout : SheetLayout
	motion : SheetMotion
	gesture : SheetGesture
}

export const createSheetContext = (props : SheetProps, emit : SheetEmit, page : any, owner : any) : SheetContext => {
	const slots = useSlots()
	// 裸内容模式：调用方自带滚动容器
	const isBare = computed<boolean>(() => !!slots.body)
	// 自动高度：按默认插槽内容的自然高度定面板高度（忽略 height）；裸内容由调用方定高，不参与
	const autoFit = computed<boolean>(() => props.autoHeight === true && !isBare.value)
	// 可拖动：closable 为 false 时恒不可拖
	const canDrag = computed<boolean>(() => props.closable === true && props.draggable === true)
	// 露头模式：关闭位露出头部
	const peek = computed<boolean>(() => props.peek === true)
	// 头部形态：把手行 / 标题行是否显示
	const showHandle = computed<boolean>(() => props.head == 'handle' || props.head == 'both' || (props.head == null && peek.value))
	const showHeader = computed<boolean>(() => props.head == 'header' || props.head == 'both' || (props.head == null && !peek.value))
	const nodeKey = getUUID()
	return {
		props,
		emit,
		page,
		owner,
		isBare,
		autoFit,
		canDrag,
		peek,
		showHandle,
		showHeader,
		maskEl : ref<any>(null),
		// 面板高度与位移的初值同为 1：挂载量过几何之前面板不显示
		panelTop : ref<number>(0),
		panelH : ref<number>(1),
		reserve : computed<number>(() => OVER_MAX),
		opened : ref<boolean>(false),
		shown : ref<boolean>(false),
		mounted : ref<boolean>(false),
		fading : ref<boolean>(false),
		atTop : ref<boolean>(true),
		panelId : `app-sheet-panel-${nodeKey}`,
		fadeId : `app-sheet-fade-${nodeKey}`,
		phase : 'closed',
		sheetY : 1,
		mode : 'none',
		dragTouchId : null,
		headH : 1,
		closedH : 0,
		fitPending : false,
		guardTop : -1,
		platform : null as any as SheetPlatform,
		layout : null as any as SheetLayout,
		motion : null as any as SheetMotion,
		gesture : null as any as SheetGesture
	}
}
