// 分段器各职责模块共用的上下文：属性与事件、响应式状态与烘焙类、组件实例，以及跨模块读写的普通状态。
// 模块之间不互相引用，一律经 ctx 读写；selection / layout / motion / gesture / tap 五个模块在入口组装时挂上来
import { computed, ref } from 'vue'
import type { ComputedRef, Ref, Slots } from 'vue'
import type { SegmentedGesture } from './segmented-gesture'
import type { SegmentedLayout } from './segmented-layout'
import type { SegmentedMotion } from './segmented-motion'
import type { SegmentedSelection } from './segmented-selection'
import type { SegmentedTap } from './segmented-tap'
import { createSpringControl } from '@/utils/spring'

export type SegmentedOption = {
	label : string
	value : string
	disabled ?: boolean
	// uni-icons 字形名（或用 #icon 插槽）
	icon ?: string
}

// 选项归一后的形态（icon 空串=无图标）
export type SegItem = { label : string, value : string, disabled : boolean, icon : string }

export type SegmentedProps = {
	options : (string | SegmentedOption)[]
	modelValue ?: string
	size ?: 'small' | 'default' | 'large'
	shape ?: 'default' | 'round'
	disabled ?: boolean
	block : boolean
	hover : boolean
}

export type SegmentedEmit = {
	(e : 'update:modelValue', value : string) : void
	(e : 'change', value : string) : void
}

// 滑块越过两端时，越界量转成自身宽度压缩的比例（越小越硬）；压缩量封顶段宽的 14%
export const SQUASH = 0.32

export type SegmentedContext = {
	props : SegmentedProps
	emit : SegmentedEmit
	// 组件实例（段位量测用）
	owner : any
	// ---- 响应式状态 ----
	// 选项归一（烘焙源）
	items : ComputedRef<SegItem[]>
	// 选中索引（单一响应式真源：滑块位移/段文字变色同源）
	index : Ref<number>
	// 胶囊形态 / 全局禁用 / 占满父容器宽度
	isRound : ComputedRef<boolean>
	isDisabledAll : ComputedRef<boolean>
	isBlock : ComputedRef<boolean>
	// 内容宽模式：段位先按自然宽排版，量到最宽者后统一等宽；量到之前滑块不显示
	cellW : Ref<number>
	ready : ComputedRef<boolean>
	cellStyle : ComputedRef<any>
	// 模板用的类名：根、内容行、段位、图标槽、图标槽渲染条件、滑块
	rootCls : ComputedRef<string>
	rowCls : ComputedRef<string>
	itemCls : ComputedRef<string>
	iconCls : ComputedRef<string>
	hasIcon : ComputedRef<boolean>
	pointerCls : ComputedRef<string>
	// 段宽（px）；拖动位移 dragX 与弹簧位移 animX 是 :style 载体，null=该通道没有在用
	segW : Ref<number>
	dragX : Ref<number | null>
	animX : Ref<number | null>
	pointerStyle : ComputedRef<any>
	// 按压高亮的段序号；-1=没有
	pressIdx : Ref<number>
	// 滑块影子（按压高亮）的位移样式
	ghostStyle : ComputedRef<any>
	// 各段文字类、图标类（含状态色）
	labelCls : ComputedRef<string[]>
	glyphCls : ComputedRef<string[]>
	// 组元素引用（量测用）
	groupEl : Ref<any>
	// ---- 跨模块读写的普通状态：只能经 ctx.xxx 读写，不能解构出来 ----
	// 当前跟踪的触点标识；null=没有。标识由系统分配、可为任意整数（iOS Safari 为负数），不能拿具体数值表示「没有」
	dragTouchId : number | null
	// 组左缘（页面可显示区域坐标），判触点是否落在滑块上
	groupLeft : number
	// 滑块落位的物理弹簧
	springCtl : ReturnType<typeof createSpringControl>
	// ---- 组装时挂上的模块 ----
	selection : SegmentedSelection
	layout : SegmentedLayout
	motion : SegmentedMotion
	gesture : SegmentedGesture
	tap : SegmentedTap
}

export const createSegmentedContext = (props : SegmentedProps, emit : SegmentedEmit, slots : Slots, owner : any) : SegmentedContext => {
	// 选项归一（烘焙源）
	const items = computed<SegItem[]>(() => {
		return (props.options ?? []).map((o : string | SegmentedOption) : SegItem => {
			if (typeof o === 'string') {
				return { label: o, value: o, disabled: false, icon: '' }
			}
			return { label: o.label, value: o.value, disabled: o.disabled === true, icon: o.icon ?? '' }
		})
	})

	// 选中索引（单一响应式真源：滑块位移/段文字变色同源）
	const index = ref<number>(0)

	// 烘焙类（纯属性读）
	const isRound = computed<boolean>(() => props.shape === 'round')
	const isDisabledAll = computed<boolean>(() => props.disabled === true)
	const isSmall = computed<boolean>(() => props.size === 'small')
	const isBlock = computed<boolean>(() => props.block)

	// 内容宽模式：段位先按自然宽排版，量到最宽者后统一等宽；量到之前滑块不显示
	const cellW = ref<number>(0)
	const ready = computed<boolean>(() => isBlock.value || cellW.value > 0)
	const cellStyle = computed<any>(() => {
		return (!isBlock.value && cellW.value > 0) ? { width: cellW.value + 'px' } : {}
	})

	const rootCls = computed<string>(() => (isRound.value ? 'app-segmented--round' : '')
		+ (isBlock.value ? '' : ' app-segmented--hug'))
	const rowCls = computed<string>(() => (isBlock.value ? '' : 'app-segmented-row--hug'))
	// 尺寸档落段位（内距直构；default 档走基类）
	const itemCls = computed<string>(() => {
		let cls = props.size === 'small' ? 'app-segmented-item--small'
			: (props.size === 'large' ? 'app-segmented-item--large' : '')
		if (!isBlock.value) {
			cls += (cls === '' ? '' : ' ') + 'app-segmented-item--hug'
		}
		return cls
	})
	const iconCls = computed<string>(() => (isSmall.value ? 'app-segmented-icon-sm' : ''))
	// 图标槽渲染条件：任一段带 icon，或提供了 #icon 插槽
	const hasIcon = computed<boolean>(() => !!slots.icon || items.value.some((o : SegItem) : boolean => o.icon !== ''))
	const pointerCls = computed<string>(() => 'app-segmented-pointer'
		+ (isRound.value ? ' app-segmented-pointer--round' : '')
		+ (ready.value ? '' : ' app-segmented-pointer-hide'))

	// 滑块位移：拖动 dragX 1:1 跟手 / 弹簧 animX 逐帧 / 稳态=index×segW（全 JS 驱动，走 :style 绑定）；
	// 越过两端时外缘钉在端点，越界量转成宽度压缩（缩放原点居中，平移量=压缩量的一半）
	const segW = ref<number>(0)
	const dragX = ref<number | null>(null)
	const animX = ref<number | null>(null)
	const pointerStyle = computed<any>(() => {
		const n = items.value.length
		const x = dragX.value != null ? dragX.value : (animX.value != null ? animX.value : index.value * segW.value)
		const width = n > 0 ? (100 / n) + '%' : '0px'
		const max = (n - 1) * segW.value
		let dir = 0
		if (segW.value > 0 && x > max) {
			dir = 1
		} else if (segW.value > 0 && x < 0) {
			dir = -1
		}
		if (dir === 0) {
			return { width, transform: `translateX(${x}px)` }
		}
		const over = dir > 0 ? x - max : -x
		const sq = Math.min(over * SQUASH, segW.value * 0.14)
		return {
			width,
			transform: `translateX(${(dir > 0 ? max : 0) + dir * sq / 2}px) scaleX(${(segW.value - sq) / segW.value})`
		}
	})

	// 按压高亮（hover 可关）：按下的段显示与滑块同形同位的影子（层序在滑块下，底色取按压类）；
	// 位移超 5px（滑动/纵滚）或松手即收起
	const pressIdx = ref<number>(-1)
	const ghostStyle = computed<any>(() => {
		const n = items.value.length
		return {
			width: n > 0 ? (100 / n) + '%' : '0px',
			transform: `translateX(${Math.max(0, pressIdx.value) * segW.value}px)`
		}
	})

	// 状态色类（文字与图标共用）：禁用灰 / 选中强调（落下后才高亮，拖动中不变色）
	const stateCls = computed<string[]>(() => items.value.map((o : SegItem, i : number) : string => {
		if (o.disabled || isDisabledAll.value) {
			return 'app-segmented-disabled'
		}
		return index.value === i ? 'app-segmented-selected' : ''
	}))
	// 文本档同 app-input：small 挂 sm 修饰类，其余用基类
	const labelCls = computed<string[]>(() => items.value.map((_o : SegItem, i : number) : string => {
		return (isSmall.value ? 'app-segmented-label-sm ' : '') + stateCls.value[i]
	}))
	// 图标字形：small 缩一号，带文字时留间距
	const glyphCls = computed<string[]>(() => items.value.map((o : SegItem, i : number) : string => {
		let cls = isSmall.value ? 'app-segmented-icon-glyph-sm ' : ''
		if (o.label !== '') {
			cls += 'app-segmented-icon-gap '
		}
		return cls + stateCls.value[i]
	}))

	// 组元素引用（量测用）
	const groupEl = ref<any>(null)
	return {
		props,
		emit,
		owner,
		items,
		index,
		isRound,
		isDisabledAll,
		isBlock,
		cellW,
		ready,
		cellStyle,
		rootCls,
		rowCls,
		itemCls,
		iconCls,
		hasIcon,
		pointerCls,
		segW,
		dragX,
		animX,
		pointerStyle,
		pressIdx,
		ghostStyle,
		labelCls,
		glyphCls,
		groupEl,
		dragTouchId : null,
		groupLeft : -1,
		springCtl : createSpringControl(),
		selection : null as any as SegmentedSelection,
		layout : null as any as SegmentedLayout,
		motion : null as any as SegmentedMotion,
		gesture : null as any as SegmentedGesture,
		tap : null as any as SegmentedTap
	}
}
