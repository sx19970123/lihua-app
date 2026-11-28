// 树·状态烘焙与容器高度：行字段烘焙、动画收尾重烘焙、行数补间与滚动区高度
import { computed, ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { STD_ROW_HEIGHT, STD_TREE_EMPTY_HEIGHT } from '@/utils/tokens-std'
import type { TreeContext } from './tree-context'

// 行高/空态高度：std token 的 JS 镜像（utils/tokens-std.ts）
const ROW_HEIGHT = STD_ROW_HEIGHT
const EMPTY_HEIGHT = STD_TREE_EMPTY_HEIGHT
// 行收起动画时长与出帧间隔（ms）；时长同 index.uvue 的 app-tree-shrink，成对改
const ROW_ANIM_MS = 180
const FRAME = 16
// 动画变体类的最短保持时长（ms）：不短于行动画时长，另加渲染提交的余量
const ANIM_HOLD_MS = 220
// 重烘焙的延后（ms）：从最近一次挂动画类起算，须不短于保持时长
const REBAKE_DELAY = 260
// 容器补间比行晚起步的时间（ms，一个出帧间隔）：容器的样式写入与行的动画类可能不在同一帧生效
const TWEEN_LEAD = 16

export type TreeBake = {
	// 可见行数（空态显隐与容器行数的来源）
	visibleCount : ComputedRef<number>
	// 容器行数：收起方向与行同曲线补间，展开方向立即到位
	containerRows : Ref<number>
	// 滚动区显式高度
	scrollHeight : ComputedRef<number>
	// 取消还没触发的重烘焙（卸载时）；重烘焙由烘焙模块在挂动画类时自行安排
	cancelRebake : () => void
	// 容器行数补间到目标（收起方向），每帧把滚动区高度的变化量报给外层
	tweenRows : (rows : number) => void
	// 容器行数立即到位并停掉补间（展开方向）；外层按行动画的时长补间
	setRowsNow : (rows : number) => void
	// 停掉容器补间
	stopTween : () => void
}

export const createTreeBake = (ctx : TreeContext) : TreeBake => {
	// 状态烘焙：写入 state 字段，模板纯属性读。
	// prevShownMap 为上次的可见快照：与快照相反的行挂动画变体类，稳态不挂 animation
	const prevShownMap = new Map<string, boolean>()

	// 重烘焙定时器；null=没有
	let rebakeTimer : number | null = null

	// 以最近一次挂动画类为准延后重烘焙：此时各行的动画类都已过了保持期
	const scheduleRebake = () => {
		if (rebakeTimer != null) {
			clearTimeout(rebakeTimer)
		}
		rebakeTimer = setTimeout(() => {
			rebakeTimer = null
			ctx.animEpoch.value++
		}, REBAKE_DELAY)
	}

	const cancelRebake = () => {
		if (rebakeTimer != null) {
			clearTimeout(rebakeTimer)
			rebakeTimer = null
		}
	}

	watchEffect(() => {
		ctx.animEpoch.value // 仅登记依赖
		const set = ctx.filter.visibleKeySet.value
		const isFiltering = ctx.filtering.value
		const kw = ctx.keyword.value
		const now = Date.now()
		// 本遍是否给行挂了动画变体类
		let animated = false
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
			// class：可见性刚变的行挂动画变体类并记下保持截止时刻；保持期内沿用现有 class，过了保持期才挂稳态类
			const wasShown = prevShownMap.get(state.item.key) ?? state.shown
			if (state.shown !== wasShown) {
				state.nodeCls = 'app-tree-node ' + (state.shown ? 'app-tree-node-entering' : 'app-tree-node-collapsed-anim')
				state.animUntil = now + ANIM_HOLD_MS
				animated = true
			} else if (now >= state.animUntil) {
				state.nodeCls = state.shown ? 'app-tree-node' : 'app-tree-node app-tree-node-collapsed'
			}
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
		if (animated) {
			scheduleRebake()
		}
	})

	const visibleCount = computed(() : number => ctx.filter.visibleKeySet.value.size)

	// 容器行数：收起方向与行同曲线补间，展开方向立即到位；滚动区高度每变一次都把变化量报给外层
	const containerRows = ref<number>(visibleCount.value)

	// 滚动区显式高度：行数×行高（空态给 empty 高度），超 maxHeight 截断
	const scrollHeight = computed(() : number => {
		return containerRows.value === 0 ? EMPTY_HEIGHT : Math.min(containerRows.value * ROW_HEIGHT, ctx.props.maxHeight ?? 210)
	})

	let tweenTimer : number | null = null
	let tweenGen = 0

	const stopTween = () => {
		tweenGen++
		if (tweenTimer != null) {
			clearTimeout(tweenTimer)
			tweenTimer = null
		}
	}

	// 容器行数立即到位并停掉补间（展开方向）；外层按行动画的时长补间
	const setRowsNow = (rows : number) => {
		stopTween()
		if (containerRows.value !== rows) {
			const before = scrollHeight.value
			containerRows.value = rows
			ctx.notifyResize(scrollHeight.value - before, ROW_ANIM_MS)
		}
	}

	// 16ms setTimeout 链，easeOutSine，起步延后 TWEEN_LEAD。曲线与行的 ease-out 几乎重合且不快过它，
	// 行又不晚于本补间起步，所以容器始终不低于行的总高：只在行下方留白，不裁行。
	// 代际 token，stopTween 后已入队帧不执行
	const tweenRows = (rows : number) => {
		stopTween()
		const from = containerRows.value
		if (Math.abs(rows - from) < 0.01) {
			containerRows.value = rows
			return
		}
		const t0 = Date.now() + TWEEN_LEAD
		const myGen = tweenGen
		const tick = () => {
			if (myGen !== tweenGen) {
				return
			}
			const k = Math.min(1, Math.max(0, (Date.now() - t0) / ROW_ANIM_MS))
			const before = scrollHeight.value
			containerRows.value = k < 1 ? from + (rows - from) * Math.sin((k * Math.PI) / 2) : rows
			const delta = scrollHeight.value - before
			if (delta !== 0) {
				ctx.notifyResize(delta, 0)
			}
			if (k < 1) {
				tweenTimer = setTimeout(tick, FRAME)
			} else {
				tweenTimer = null
			}
		}
		tick()
	}

	return { visibleCount, containerRows, scrollHeight, cancelRebake, tweenRows, setRowsNow, stopTween }
}
