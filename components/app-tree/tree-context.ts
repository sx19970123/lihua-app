// 树各职责模块共用的上下文：属性与事件、响应式状态，以及组装时挂上的模块。
// 模块之间不互相引用，一律经 ctx 读写；model / filter / bake 三个模块在入口组装时挂上来
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { TreeBake } from './tree-bake'
import type { TreeFilter } from './tree-filter'
import type { TreeModel } from './tree-model'

export interface TreeItem {
	// key 必须全树唯一（显隐集合/v-for 复用以其为身份）
	key: string
	title: string
	children?: TreeItem[]
	// 业务负载字段随行携带（如部门 code），select 事件原样回传
	[prop: string]: any
}

export interface TreeState {
	item: TreeItem
	level: number
	// 行可见性（烘焙中间量：cls/showLine/firstVisible 都由它派生）与箭头朝向类
	shown: boolean
	arrowCls: string
	// 行底分隔线显隐（末个可见行下方无线，含过滤态；同样烘焙）
	showLine: boolean
	// 首个可见行（上方无线，hit 不上探；过滤态重算）
	firstVisible: boolean
	// 行/按压块的完整 class（模板纯读；x 端仅单类选择器）
	nodeCls: string
	hitCls: string
	// 行动画变体类的保持截止时刻（Date.now 毫秒时间戳）：早于它不切回稳态类；0=没有在保持
	animUntil: number
	// 标题三段（命中段高亮；非过滤态 segBefore=整段、其余空串）
	segBefore: string
	segHit: string
	segAfter: string
}

export type TreeProps = {
	data : TreeItem[]
	defaultExpandAll?: boolean
	current?: string
	filterable?: boolean
	searchPlaceholder?: string
	searchSize?: 'small' | 'default' | 'large'
	searchHeight?: number
	readonly?: boolean
	loading?: boolean
	loadingKey?: string
	maxHeight?: number
}

export type TreeEmit = {
	(e : 'update:current', key : string) : void
	(e : 'select', key : string, item : TreeItem) : void
}

export type TreeContext = {
	props : TreeProps
	emit : TreeEmit
	// ---- 响应式状态 ----
	// 全量状态列表：深度优先一次拍平，此后长度与顺序永不再变（保证元素不增删）
	allStates : Ref<TreeState[]>
	// 展开态（key 集合；树规模小，数组 includes 足够）
	expandedKeys : Ref<string[]>
	// 过滤关键字（经 filter 方法置入）
	keyword : Ref<string>
	// 过滤中：关键字非空
	filtering : ComputedRef<boolean>
	// 动画收尾重烘焙触发器：收起/展开动画播完后自增，把动画变体切回静态类
	animEpoch : Ref<number>
	// 滚动区高度变化时调用：delta=变化量（px），duration=行这段动画的时长（ms；0=容器补间中的一帧）。
	// 入口换成外层 app-resize-transition 注入的处理；外面包着它时外层才跟得上
	notifyResize : (delta : number, duration : number) => void
	// ---- 组装时挂上的模块 ----
	model : TreeModel
	filter : TreeFilter
	bake : TreeBake
}

export const createTreeContext = (props : TreeProps, emit : TreeEmit) : TreeContext => {
	// 全量状态列表：深度优先一次拍平，此后长度与顺序永不再变（保证元素不增删）
	const allStates = ref<TreeState[]>([])
	// 展开态（key 集合；树规模小，数组 includes 足够）
	const expandedKeys = ref<string[]>([])
	// 过滤关键字（经 filter 方法置入）
	const keyword = ref<string>('')
	const filtering = computed(() : boolean => keyword.value !== '')
	// 动画收尾重烘焙触发器：收起/展开动画播完后自增，把动画变体切回静态类
	const animEpoch = ref(0)
	return {
		props,
		emit,
		allStates,
		expandedKeys,
		keyword,
		filtering,
		animEpoch,
		// 滚动区高度变化时调用：delta=变化量（px），duration=行这段动画的时长（ms；0=容器补间中的一帧）。
		// 入口换成外层 app-resize-transition 注入的处理；外面包着它时外层才跟得上
		notifyResize : (_delta : number, _duration : number) : void => {},
		model : null as any as TreeModel,
		filter : null as any as TreeFilter,
		bake : null as any as TreeBake
	}
}
