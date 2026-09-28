<!--
  refresh-content：页面级下拉刷新 + 上拉加载一体组件（自绘触摸 + renderjs + mescroll 兼容 API）。
  使用契约（生成组件文档时须完整保留以下坑点）：
  1. 父级必须确定高度：页面根用 height:100vh，勿用 min-height——组件根 min-height:100% 在父链
     无确定 height 时退化为 0，列表不满屏时下方空白区域在组件根之外、touchstart 不触发（空白区无法下拉）；
  2. 页面级滚动：列表不套 scroll-view、不写死列表容器高度；不开 enablePullDownRefresh（原生下拉与手势冲突）；
  3. 每页仅一个实例：onPageScroll/onReachBottom 在组件 setup 内注册、挂到当前页面实例；
  4. 自定义导航栏（navigationStyle:custom）页面传 :top（状态栏+导航栏高的 rpx 值）；原生导航栏不传；
  5. 带 sar-swipe-action-group 的列表容器加 root-class="ptr-swipe-lock"（renderjs 侧滑锁定契约，
     防横滑列表项与下拉手势冲突）；
  6. 请求结束必须回调 mescroll.endSuccess(本页条数, 是否有下一页) / endErr()（内部自动回退页码），
     漏调会一直停在加载态；
  7. renderjs 仅 APP/H5 编译；小程序端逻辑层手势照常，微信端自绘下拉与页面回弹可能轻微叠加（已知限制）；
  8. 越阈值震动仅 APP 端生效（utils/haptic 为 APP-PLUS 条件编译），H5/小程序无感。
  用法样板：subpackages/system/components/pull-refresh/index.vue（组件演示页）。
-->
<template>
	<view
		class="refresh-content ptr-render-touch"
		:class="[
			themeClass,
			{
				'refresh-content--custom-empty': hasEmptySlot,
				'refresh-content--empty-visible': hasEmptySlot && resolvedEmptyVisible,
			},
		]"
		:style="{ paddingTop: typeof top === 'number' ? top + 'rpx' : top }"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
		@touchcancel="onTouchEnd"
	>
		<!--
			内容区（含下拉提示）整体随 downHight 平移，提示与列表共用同一位移，无阻尼差异。
			提示用 position:absolute 定位在内容区顶部、translateY(-100%) 悬于其上方，
			且 absolute 在内容区 view 内部——内容区 view 自身文档流高度不变，不扩展页面 scrollHeight（无多余滚动条）。
		-->
		<view
			class="refresh-content__body"
			:style="{ transform: 'translateY(' + downHight + 'px)', transition: isDragging ? 'none' : 'transform 300ms' }"
		>
			<!-- 下拉指示器：absolute 悬浮在内容区顶部上方（translateY(-100%)），跟随内容区一起平移 -->
			<view class="refresh-content__downwarp" :style="{ height: headerHeight + 'px' }">
				<app-loading v-if="downLoading" />
				<text v-else class="refresh-content__downtip">{{ downText }}</text>
			</view>

			<slot v-if="!resolvedLoading" />
			<view v-else class="refresh-content__loading">
				<app-loading />
			</view>

			<!-- 空态：由 empty 插槽渲染（sar-empty），由 resolvedEmptyVisible 控制 -->
			<view v-if="!resolvedLoading && resolvedEmptyVisible" class="refresh-content__empty" @click="handleEmptyClick">
				<slot name="empty"></slot>
			</view>

			<!-- 上拉加载更多区域 -->
			<view v-if="upEnabled && !resolvedEmptyVisible" class="refresh-content__upwarp">
				<app-loading v-if="upLoading" />
				<text v-else-if="upNoMore && hasMoreTip" class="refresh-content__nomore">没有更多</text>
			</view>
		</view>

		<!--
			renderjs 数据载体：必须在内容区外层，避免下拉禁用时载体丢失。
			通过 :change:prop 把逻辑层状态桥接到 renderjs 视图层，驱动同步 preventDefault。
		-->
		<!-- #ifdef APP-PLUS || H5 -->
		<view :change:prop="renderBiz.propObserver" :prop="wxsProp"></view>
		<!-- #endif -->
	</view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'
import type { PropType } from 'vue'
import { onPageScroll, onReachBottom } from '@dcloudio/uni-app'
import type { MescrollInstance } from '@/components/refresh-content/type'
import { triggerLightHaptic } from '@/utils/haptic'

type ThemeMode = 'auto' | 'light' | 'dark'
type OptionRecord = Record<string, any>

const props = defineProps({
	top: {
		type: [String, Number],
		default: 0,
	},
	bottom: {
		type: [String, Number],
		default: 0,
	},
	down: {
		type: Object as PropType<OptionRecord>,
		default: () => ({}),
	},
	up: {
		type: Object as PropType<OptionRecord>,
		default: () => ({}),
	},
	// 以下为旧 mescroll-body 专属配置，新版改用普通容器后转为 no-op，保留接收避免页面传参报错。
	topbar: {
		type: [Boolean, String],
		default: false,
	},
	safearea: {
		type: Boolean,
		default: false,
	},
	bottombar: {
		type: Boolean,
		default: true,
	},
	sticky: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String as PropType<ThemeMode>,
		default: 'auto',
	},
	empty: {
		type: Boolean,
		default: undefined,
	},
	loading: {
		type: Boolean,
		default: undefined,
	},
})

const emit = defineEmits<{
	init: [mescroll: MescrollInstance]
	refresh: [mescroll: MescrollInstance]
	'load-more': [mescroll: MescrollInstance]
	emptyclick: [mescroll: MescrollInstance]
}>()

const slots = useSlots()

/** 下拉相关配置与状态 */
const downEnabled = computed(() => props.down?.use !== false)
const downAuto = computed(() => props.down?.auto !== false)
// 阻尼参数（沿用 mescroll 默认值：阈值前 1:1，阈值后 ×0.2）
const offset = computed(() => Number(props.down?.offset) || 80)
const inOffsetRate = computed(() => {
	const v = Number(props.down?.inOffsetRate)
	return Number.isFinite(v) ? v : 1
})
const outOffsetRate = computed(() => {
	const v = Number(props.down?.outOffsetRate)
	return Number.isFinite(v) ? v : 0.2
})

const downLoading = ref(false)
const downHight = ref(0)
const isDragging = ref(false)
const isDownScrolling = ref(false)
const downText = ref('下拉刷新')
const minAngle = 45 // 角度门控：防止横向 swiper 误触
const headerHeight = 56 // 下拉指示器固定高度（px），松手触发刷新时收起到此高度

/** 上拉相关状态 */
const upEnabled = computed(() => !!props.up?.use)
const upAuto = computed(() => props.up?.auto !== false)
const upLoading = ref(false)
const upNoMore = ref(false)
const isUpScrolling = ref(false)
const noMoreSize = computed(() => {
	const v = Number(props.up?.noMoreSize)
	return Number.isFinite(v) ? v : 5
})
const loadedSize = ref(0)
const pageNum = ref(0)
const pageSize = computed(() => Number(props.up?.page?.size) || 10)

/** 滚动位置 */
const scrollTop = ref(0)

/** 触摸临时变量（非响应式，避免频繁触发渲染） */
let startPoint = { x: 0, y: 0 }
let lastPoint = { x: 0, y: 0 }
let lockDirection = ''
let movetype = 0 // 0:未越阈值 1:已越阈值，用于触感去重

const themeClass = computed(() => `refresh-content--${props.theme}`)
const hasEmptySlot = computed(() => !!slots.empty)
const resolvedEmptyVisible = computed(() => props.empty ?? false)
const resolvedLoading = computed(() => !!props.loading)
const hasMoreTip = computed(() => (noMoreSize.value === 0 ? true : loadedSize.value >= noMoreSize.value))

/**
 * 桥接到 renderjs 视图层的状态对象。
 * renderjs 据此在原生滚动提交前同步 preventDefault，阻止 iOS 橡皮筋。
 */
const wxsProp = computed(() => ({
	optDown: { use: downEnabled.value },
	scrollTop: scrollTop.value,
	isDownScrolling: isDownScrolling.value,
	isUpScrolling: isUpScrolling.value,
	isUpBoth: false,
}))

/**
 * 兼容垫片：mescroll 形状的 API 对象，作为 @init/@refresh/@load-more 的回传值。
 * 页面调用 mescroll.endSuccess(count, hasNext) / endErr() 等方法，内部映射到状态机。
 */
let apiObj: MescrollInstance = {} as MescrollInstance

function buildApi(): MescrollInstance {
	const api: MescrollInstance = {
		optDown: { use: downEnabled.value, auto: downAuto.value },
		optUp: { use: upEnabled.value, hasNext: !upNoMore.value },
		num: pageNum.value,
		size: pageSize.value,
		endSuccess: (dataSize?: number, hasNext?: boolean) => finishRequest(dataSize, hasNext),
		endErr: () => finishError(),
		endByPage: (dataSize: number, totalPage?: number) =>
			finishRequest(dataSize, totalPage ? pageNum.value < totalPage : false),
		endBySize: (dataSize: number, totalSize?: number) =>
			finishRequest(dataSize, totalSize ? pageNum.value * pageSize.value < totalSize : false),
		resetUpScroll: (isShowLoading?: boolean) => {
			upNoMore.value = false
			upLoading.value = !!isShowLoading
			pageNum.value = 0
			loadedSize.value = 0
		},
		triggerDownScroll: () => {
			if (!downEnabled.value) return
			isDownScrolling.value = true
			downLoading.value = true
			downText.value = '正在刷新'
			pageNum.value = 1
			upNoMore.value = false
			refreshApiObj()
			emit('refresh', apiObj)
		},
		triggerUpScroll: () => {
			tryLoadMore()
		},
		scrollTo: (y: number | string, duration?: number) => {
			uni.pageScrollTo({ scrollTop: Number(y), duration: duration ?? 300 })
		},
		getScrollTop: () => scrollTop.value,
		onPullDownRefresh: () => {},
		onPageScroll: () => {},
		onReachBottom: () => {},
	}
	return api
}

function refreshApiObj() {
	apiObj = buildApi()
}

/** 获取第一个手指坐标 */
function getPoint(e: any): { x: number; y: number } {
	const t = e.touches?.[0] || e.changedTouches?.[0]
	if (t) return { x: t.pageX, y: t.pageY }
	return { x: e.clientX || 0, y: e.clientY || 0 }
}

/** 计算两点夹角（用于判断是否竖直下拉，防 swiper 误触） */
function getAngle(x: number, y: number): number {
	const r = Math.atan2(y, x)
	const angle = (r * 180) / Math.PI
	return angle >= 0 ? angle : angle + 360
}

function onTouchStart(e: any) {
	if (!downEnabled.value || isDownScrolling.value) return
	// 仅在页面顶部时记录起点，启用下拉
	if (scrollTop.value > 0) return
	startPoint = getPoint(e)
	lastPoint = startPoint
	lockDirection = ''
	movetype = 0
}

function onTouchMove(e: any) {
	if (!downEnabled.value || isDownScrolling.value) return
	const curPoint = getPoint(e)
	const diffY = curPoint.y - lastPoint.y
	const moveY = curPoint.y - startPoint.y

	// 角度门控：仅竖直下拉（角度在 45~135° 之间）才接管，防横向 swiper
	if (lockDirection === '') {
		const moveX = curPoint.x - startPoint.x
		if (Math.abs(moveX) > 4 || Math.abs(moveY) > 4) {
			const angle = getAngle(moveX, moveY)
			lockDirection = angle >= minAngle && angle < 180 - minAngle ? 'down' : 'others'
		}
	}
	if (lockDirection !== 'down') return

	e.preventDefault?.()
	isDragging.value = true
	lastPoint = curPoint

	// 两段线性阻尼：阈值前 1:1，阈值后 ×outOffsetRate，回弹(diffY<0)1:1
	if (downHight.value < offset.value) {
		if (downHight.value + diffY * inOffsetRate.value >= offset.value) {
			// 跨越阈值
			const over = downHight.value + diffY * inOffsetRate.value - offset.value
			downHight.value = offset.value + over * outOffsetRate.value
		} else {
			downHight.value += diffY * inOffsetRate.value
		}
	} else {
		if (diffY > 0) {
			downHight.value += diffY * outOffsetRate.value
		} else {
			downHight.value += diffY
		}
	}
	downHight.value = Math.round(downHight.value)

	// 状态文字 + 触感（越过阈值时震动一次）
	if (downHight.value >= offset.value) {
		downText.value = '松开刷新'
		if (movetype !== 1) {
			movetype = 1
			triggerLightHaptic()
		}
	} else {
		downText.value = '下拉刷新'
		movetype = 0
	}
}

function onTouchEnd() {
	if (!downEnabled.value || isDownScrolling.value) return
	if (lockDirection !== 'down') {
		isDragging.value = false
		return
	}
	isDragging.value = false
	movetype = 0
	lockDirection = ''
	if (downHight.value >= offset.value) {
		// 越过阈值松手 → 触发刷新，收起到指示器高度
		downHight.value = headerHeight
		isDownScrolling.value = true
		downLoading.value = true
		downText.value = '正在刷新'
		pageNum.value = 1
		upNoMore.value = false
		refreshApiObj()
		emit('refresh', apiObj)
	} else {
		// 未越过阈值 → 回弹收起
		downHight.value = 0
	}
}

/** 页面请求完成回调（endSuccess/endByPage/endBySize 最终都走这里） */
function finishRequest(dataSize?: number, hasNext?: boolean) {
	// 收起下拉
	if (isDownScrolling.value) {
		isDownScrolling.value = false
		downLoading.value = false
		downText.value = '刷新完成'
		loadedSize.value = Number(dataSize) || 0
		// 短暂展示"刷新完成"后收起
		setTimeout(() => {
			downHight.value = 0
			downText.value = '下拉刷新'
		}, 300)
	} else if (upLoading.value) {
		loadedSize.value += Number(dataSize) || 0
	}
	upLoading.value = false
	isUpScrolling.value = false
	const hasMore = hasNext ?? (Number(dataSize) >= pageSize.value)
	upNoMore.value = !hasMore
}

/** 页面请求失败回调（endErr）：短暂展示"刷新失败"再收起，给用户失败感知 */
function finishError() {
	if (isDownScrolling.value) {
		isDownScrolling.value = false
		downLoading.value = false
		downText.value = '刷新失败'
		// 短暂展示"刷新失败"后收起
		setTimeout(() => {
			downHight.value = 0
			downText.value = '下拉刷新'
		}, 800)
	} else if (upLoading.value) {
		upLoading.value = false
		// 上拉加载失败：回退页码，便于下次重试
		if (pageNum.value > 0) pageNum.value -= 1
	}
	isUpScrolling.value = false
}

/** 触底加载更多：onReachBottom → 进入 loading 态 → emit load-more */
function tryLoadMore() {
	if (!upEnabled.value || upLoading.value || upNoMore.value) return
	upLoading.value = true
	isUpScrolling.value = true
	pageNum.value += 1
	refreshApiObj()
	emit('load-more', apiObj)
}

function handleEmptyClick() {
	refreshApiObj()
	emit('emptyclick', apiObj)
}

/**
 * 页面滚到顶部时启用下拉（scrollTop<=0 兼容 iOS 负值）。
 */
onPageScroll((e: { scrollTop: number }) => {
	scrollTop.value = e.scrollTop || 0
})

onReachBottom(() => {
	if (upEnabled.value) {
		tryLoadMore()
	}
})

onMounted(() => {
	refreshApiObj()
	emit('init', apiObj)
	if (upEnabled.value && upAuto.value) {
		tryLoadMore()
	}
})

defineExpose({
	getMescroll: () => apiObj,
	triggerDownScroll: () => apiObj.triggerDownScroll?.(),
	resetUpScroll: (isShowLoading?: boolean) => apiObj.resetUpScroll?.(isShowLoading),
	endSuccess: (...args: Parameters<MescrollInstance['endSuccess']>) => apiObj.endSuccess?.(...args),
	endErr: (errDistance?: number) => apiObj.endErr?.(errDistance),
	scrollTo: (y: number | string, duration?: number) => apiObj.scrollTo?.(y, duration),
})
</script>

<!-- #ifdef APP-PLUS || H5 -->
<script module="renderBiz" lang="renderjs">
import renderBiz from './render-renderjs.js'
export default renderBiz
</script>
<!-- #endif -->

<style scoped>
/*
 * top 偏移用 padding-top（非 margin-top）+ box-sizing:border-box + min-height:100%，
 * 沿用 mescroll-body 机制：padding 在内容盒内部，不会在页面 min-height:100vh 之外额外累加高度，
 * 避免内容多出一个 navbar 高度（margin-top 会与 min-height:100vh 叠加导致溢出）。
 * min-height:100% 相对父容器，保证列表不满屏仍可下拉。
 * 坑：百分比 min-height 需父链有确定 height 才能解析——父级只写 min-height:100vh 时本值退化为 0，
 * 组件根只剩内容高，下方空白区域不在组件根内、无法下拉；消费页面根节点必须 height:100vh
 * （内容超出时本根随内容撑开、页面照常滚动，行为不受影响）。机理详见文件头部使用契约第 1 条。
 */
.refresh-content {
	box-sizing: border-box;
	min-height: 100%;
	--refresh-content-bg: var(--sar-body-bg);
	--refresh-content-text-color: var(--sar-secondary-color);
	--refresh-content-empty-color: var(--sar-tertiary-color);
	background: var(--refresh-content-bg);
	color: var(--refresh-content-text-color);
}

/* 内容区：relative 作为下拉提示的定位基准，整体随 downHight 平移 */
.refresh-content__body {
	position: relative;
}

/* 下拉指示器：absolute 悬浮在内容区顶部上方（translateY(-100%)），跟随内容区一起平移。
   因在 .refresh-content__body 内部且 absolute，不扩展文档流高度，无多余滚动条。 */
.refresh-content__downwarp {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	transform: translateY(-100%);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	overflow: hidden;
	background: var(--refresh-content-bg);
}

.refresh-content__downtip {
	font-size: 26rpx;
	color: var(--refresh-content-text-color);
}

.refresh-content__empty {
	box-sizing: border-box;
	min-height: 320rpx;
	padding: 96rpx 32rpx;
	color: var(--refresh-content-empty-color);
	text-align: center;
}

/* 首次/静默加载占位：撑满可视区域并居中 */
.refresh-content__loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 60vh;
}

/* 上拉加载更多区域 */
.refresh-content__upwarp {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32rpx 0;
	color: var(--refresh-content-text-color);
}

.refresh-content__nomore {
	font-size: 26rpx;
	color: var(--refresh-content-text-color);
}
</style>
