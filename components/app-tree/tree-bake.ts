// 树·状态烘焙与容器高度：行字段烘焙、动画收尾重烘焙、行数延迟跟随与滚动区高度
import { computed, ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { STD_ROW_HEIGHT, STD_TREE_EMPTY_HEIGHT } from '@/utils/tokens-std'
import type { TreeContext } from './tree-context'

// 行高/空态高度：std token 的 JS 镜像（utils/tokens-std.ts）
const ROW_HEIGHT = STD_ROW_HEIGHT
const EMPTY_HEIGHT = STD_TREE_EMPTY_HEIGHT

export type TreeBake = {
	// 可见行数（空态显隐与容器行数的来源）
	visibleCount : ComputedRef<number>
	// 容器行数（收起方向延迟跟随）
	deferredRows : Ref<number>
	// 滚动区显式高度
	scrollHeight : ComputedRef<number>
}

export const createTreeBake = (ctx : TreeContext) : TreeBake => {
	// 状态烘焙：写入 state 字段，模板纯属性读。
	// prevShownMap 为上次的可见快照：与快照相反的行挂动画变体类，稳态不挂 animation
	const prevShownMap = new Map<string, boolean>()

	watchEffect(() => {
		ctx.animEpoch.value // 仅登记依赖
		const set = ctx.filter.visibleKeySet.value
		const isFiltering = ctx.filtering.value
		const kw = ctx.keyword.value
		// 第一遍（正序）：可见性/箭头/标题分段 + 首可见行 + class 烘焙
		let seenBefore = false
		ctx.allStates.value.forEach(state => {
			state.shown = set.has(state.item.key)
			state.arrowCls = ctx.model.hasChildren(state.item) && (isFiltering || ctx.expandedKeys.value.includes(state.item.key))
				? 'app-tree-arrow-open' : ''
			// 标题分段：首命中三段式（多命中只点亮第一处；未命中=整段）
			const idx = kw ? state.item.title.indexOf(kw) : -1
			if (idx >= 0) {
				state.segBefore = idx > 0 ? state.item.title.slice(0, idx) : ''
				state.segHit = kw
				state.segAfter = state.item.title.slice(idx + kw.length)
			} else {
				state.segBefore = state.item.title
				state.segHit = ''
				state.segAfter = ''
			}
			// 首可见行不上探（上探会伸出滚动区顶被裁）
			state.firstVisible = !seenBefore && state.shown
			if (state.shown) {
				seenBefore = true
			}
		// class：刚变化的行挂动画变体（180ms），稳态挂无动画静态类
		const wasShown = prevShownMap.get(state.item.key) ?? state.shown
		let nodeCls = 'app-tree-node'
		if (!state.shown) {
			nodeCls += wasShown ? ' app-tree-node-collapsed-anim' : ' app-tree-node-collapsed'
		} else if (!wasShown) {
			nodeCls += ' app-tree-node-entering'
		}
		state.nodeCls = nodeCls
			state.hitCls = 'app-tree-hit' + (state.firstVisible ? ' app-tree-hit-first' : '')
			prevShownMap.set(state.item.key, state.shown)
		})
		// 第二遍（倒序）：底线——本行可见且之后仍存在可见行才显示（末个可见行下方无线；过滤态同样成立）
		let seenAfter = false
		for (let i = ctx.allStates.value.length - 1; i >= 0; i--) {
			const state = ctx.allStates.value[i]
			state.showLine = seenAfter
			if (state.shown) {
				seenAfter = true
			}
		}
	})

	const visibleCount = computed(() : number => ctx.filter.visibleKeySet.value.size)

	// 容器行数延迟跟随（收起方向）：动画播完容器再收终值，否则渐收中的末尾行会被裁在视口外；
	// 展开/收起后 200ms 重烘焙一次，把播完的动画变体切回稳态类
	const deferredRows = ref<number>(visibleCount.value)

	// 滚动区显式高度：行数×行高（空态给 empty 高度），超 maxHeight 截断
	const scrollHeight = computed(() : number => {
		return deferredRows.value === 0 ? EMPTY_HEIGHT : Math.min(deferredRows.value * ROW_HEIGHT, ctx.props.maxHeight ?? 210)
	})

	return { visibleCount, deferredRows, scrollHeight }
}
