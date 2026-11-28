// 侧滑各职责模块共用的上下文：属性与事件、响应式状态（模板绑定与 style 载体）、跨模块读写的普通状态。
// 模块之间不互相引用，一律经 ctx 读写；platform / carrier / sides / motion / confirm / gesture / gear 在入口组装时挂上来
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { SwipeCarrier } from './swipe-carrier'
import type { SwipeConfirm } from './swipe-confirm'
import type { SwipeGesture } from './swipe-gesture'
import type { SwipeGear } from './swipe-gear'
import type { SwipeMotion } from './swipe-motion'
import type { SwipeSide } from './swipe-side'
import type { SwipePlatform } from './swipe-platform'
import { SIDE_L, SIDE_R } from './swipe-platform'

export type SwipeAction = {
	// 按钮文案
	text : string
	// 事件标识（@action 回传）
	event : string
	// danger=红底（危险操作），默认蓝底
	type ?: string
	// 自定义按钮背景色（优先于 type 配色）
	color ?: string
	// 点击后进确认态（按钮排滑出、确认条滑入），确认后动画播完触发 @action
	confirm ?: boolean
	// 确认条文案
	confirmText ?: string
	// 所属侧：left=左组（右滑展开）；缺省 right=右组（左滑展开）——单集合按业务自由拼装
	side ?: string
	// 业务透传负载（组件不读，@action 原样回传——放 id/record 等，
	// 循环消费免维护 event→业务 的映射）
	data ?: any
}

export type SwipeProps = {
	actions : SwipeAction[]
	disabled ?: boolean
	divider ?: boolean
	loading ?: boolean
}

export type SwipeEmit = {
	// 按钮最终确认（唯一业务回调）：非 confirm 型点击即回传；confirm 型在行消失动画
	// 播完后回传（业务此时清数据动画不被截断）——回传整个按钮 item（event+data 均可读）
	(e : 'action', action : SwipeAction) : void
	// 展开完成（side='left'|'right'，含程序化 open）
	(e : 'open', side : string) : void
	// 收起完成（含互斥/程序化 close）
	(e : 'close') : void
}

export type SwipeContext = {
	props : SwipeProps
	emit : SwipeEmit
	// ---- 响应式状态 ----
	// 左右两组按钮（左组渲染序已反转：数组序=贴行界→贴内容）
	leftList : ComputedRef<SwipeAction[]>
	rightList : ComputedRef<SwipeAction[]>
	// 元素引用（app/鸿蒙/H5 写层与量测用；MP 端不读）
	contentEl : Ref<any>
	btnElsL : Ref<any[]>
	btnElsR : Ref<any[]>
	textElsL : Ref<any[]>
	textElsR : Ref<any[]>
	// 响应式 style 载体（:style 绑定）：MP 的写通道；app 只取首帧初值
	btnStyleL : Ref<any[]>
	btnStyleR : Ref<any[]>
	textStyleL : Ref<any[]>
	textStyleR : Ref<any[]>
	contentStyle : Ref<any>
	// 确认条：文案、被确认的钮序号（-1=无）、所在侧
	confirmLabel : Ref<string>
	confirmIndex : Ref<number>
	confirmSide : Ref<number>
	// 直点冻结：是否在等 loading、被点钮所在侧与序号
	directBusy : Ref<boolean>
	directSide : Ref<number>
	directIndex : Ref<number>
	// spinner 落点：该侧被冻结钮的序号（-1=不显示）、左偏移（px）与样式
	spinnerAtL : ComputedRef<number>
	spinnerAtR : ComputedRef<number>
	spinnerLeft : Ref<number>
	spinnerStyle : ComputedRef<any>
	// 确认态：二次确认条已滑出
	confirming : Ref<boolean>
	// 行消失动画进行中
	removing : Ref<boolean>
	// ---- 跨模块读写的普通状态：只能经 ctx.xxx 读写，不能解构出来 ----
	// 状态：当前内容位移档（0 收起 / -W 展开）
	currentX : number
	// 确认补间当前进度（打断后新补间从当前位起跳）
	confirmW : number
	confirmM : number
	// 进确认时的 item 顶开量
	confirmExtra : number
	// 确认形态滑出后的宽度残留侧（-1=无），下次交互前复位
	confirmResidueSide : number
	// 当前跟踪的触点标识；null=没有。标识由系统分配、可为任意整数（iOS Safari 为负数），不能拿具体数值表示「没有」
	dragTouchId : number | null
	// 拖拽被互斥打断：后续 move/end 全忽略直到抬手
	dragCancelled : boolean
	// 跨域阻尼侧：开态域起拖时记对侧（SIDE_L/SIDE_R），该侧域自中线起整段受阻尼；-1=无，仅拖拽期间有效
	crossDamp : number
	// 常量：loading spinner 在被点钮文字左侧让出的横向留白（px）
	SPIN_PAD : number
	// ---- 组装时挂上的模块 ----
	platform : SwipePlatform
	carrier : SwipeCarrier
	// 左右两个侧实体（下标=SIDE_L / SIDE_R）
	sides : SwipeSide[]
	motion : SwipeMotion
	confirm : SwipeConfirm
	gesture : SwipeGesture
	gear : SwipeGear
}

export const createSwipeContext = (props : SwipeProps, emit : SwipeEmit) : SwipeContext => {
	const sideListOf = (s : string) => props.actions.filter((a : SwipeAction) => (a.side ?? 'right') === s)
	// 左组渲染序反转：反转后数组序=贴行界→贴内容，与右组层序语义一致
	const leftList = computed<SwipeAction[]>(() => sideListOf('left').slice().reverse())
	const rightList = computed<SwipeAction[]>(() => sideListOf('right'))

	const confirmLabel = ref<string>('')
	const confirmIndex = ref<number>(-1)
	const confirmSide = ref<number>(SIDE_R)

	// loading spinner（常驻零销毁，显隐烘焙类）：absolute 不入流，贴被点钮文字左侧
	const directBusy = ref<boolean>(false)
	const directSide = ref<number>(SIDE_R)
	const directIndex = ref<number>(-1)
	// spinner 落点=被冻结的钮（确认链优先）
	const spinnerTarget = (sideId : number) : number => {
		if (props.loading !== true) {
			return -1
		}
		if (confirming.value && confirmSide.value === sideId) {
			return confirmIndex.value
		}
		if (directBusy.value && directSide.value === sideId) {
			return directIndex.value
		}
		return -1
	}
	const spinnerAtL = computed<number>(() => spinnerTarget(SIDE_L))
	const spinnerAtR = computed<number>(() => spinnerTarget(SIDE_R))
	const spinnerLeft = ref<number>(0)
	const spinnerStyle = computed<any>(() => {
		return {
			left: `${spinnerLeft.value}px`
		}
	})

	const confirming = ref<boolean>(false)
	return {
		props,
		emit,
		leftList,
		rightList,
		contentEl : ref<any>(null),
		btnElsL : ref<any[]>([]),
		btnElsR : ref<any[]>([]),
		textElsL : ref<any[]>([]),
		textElsR : ref<any[]>([]),
		btnStyleL : ref<any[]>([]),
		btnStyleR : ref<any[]>([]),
		textStyleL : ref<any[]>([]),
		textStyleR : ref<any[]>([]),
		contentStyle : ref<any>({}),
		confirmLabel,
		confirmIndex,
		confirmSide,
		directBusy,
		directSide,
		directIndex,
		spinnerAtL,
		spinnerAtR,
		spinnerLeft,
		spinnerStyle,
		confirming,
		removing : ref<boolean>(false),
		currentX : 0,
		confirmW : 0,
		confirmM : 0,
		confirmExtra : 0,
		confirmResidueSide : -1,
		dragTouchId : null,
		dragCancelled : false,
		crossDamp : -1,
		SPIN_PAD : 22,
		// ---- 组装时挂上的模块 ----
		platform : null as any as SwipePlatform,
		carrier : null as any as SwipeCarrier,
		sides : null as any as SwipeSide[],
		motion : null as any as SwipeMotion,
		confirm : null as any as SwipeConfirm,
		gesture : null as any as SwipeGesture,
		gear : null as any as SwipeGear
	}
}
