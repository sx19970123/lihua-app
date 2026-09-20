<template>
	<view class="page">
		<RefreshContent
			:down="{ use: true, offset: 80 }"
			:up="{ use: true, auto: false, page: { size: 10 } }"
			:loading="!loaded"
			:empty="loaded && items.length === 0"
			@init="onInit"
			@refresh="onRefresh"
			@load-more="onLoadMore"
		>
			<template #empty>
				<sar-empty description="暂无数据"/>
			</template>

			<view class="doc">
				<view class="title">组件说明</view>
				<view class="description">页面级下拉刷新 + 上拉加载一体组件（自绘触摸手势 + mescroll 兼容 API），用于替代原生 enablePullDownRefresh。手势仅在页面滚到顶部时接管；两段阻尼（阈值前 1:1、越阈值后 0.2）；越阈值轻震动一次。</view>
				<view class="title">页面滚动前提</view>
				<view class="description">· 列表不套 scroll-view、不写死页面高度（依赖页面级滚动）</view>
				<view class="description">· 不开启 enablePullDownRefresh（原生下拉与手势冲突）</view>
				<view class="description">· 页面根节点 min-height:100vh 作文档地板，吸收下拉指示器溢出</view>
				<view class="description">· onPageScroll/onReachBottom 注册在组件内，每页仅可放一个实例</view>
				<view class="description">· 自定义导航栏页面需传 :top（状态栏 + 导航栏高的 rpx 值）</view>
				<view class="title">API 要点</view>
				<view class="description">· props：down{use,auto,offset}、up{use,auto,page.size}、loading（首屏占位）、empty（空态插槽显隐）、top</view>
				<view class="description">· emits：init / refresh / load-more / emptyclick</view>
				<view class="description">· 请求结束必须回调：mescroll.endSuccess(本页条数, 是否有下一页) 或 mescroll.endErr()（失败内部自动回退页码）</view>
				<view class="description">· renderjs 仅 APP/H5 编译，在原生滚动提交前同步 preventDefault 阻止橡皮筋；小程序端剥离后逻辑层手势照常（微信端下拉与页面回弹可能轻微叠加，属已知限制）</view>
			</view>

			<view class="demo">
				<view class="title">演示</view>
				<view class="description">在顶部下拉松手刷新；滚到底部自动加载，第 4 页起提示「没有更多」。</view>
				<sar-list card>
					<sar-list-item v-for="i in items" :key="i" :title="`条目 ${i}`"/>
				</sar-list>
			</view>
		</RefreshContent>
	</view>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import RefreshContent from '@/components/refresh-content/index.vue'
import type { MescrollInstance } from '@/components/refresh-content/type'

const PAGE_SIZE = 10
const MAX_ITEMS = 35

const items = ref<number[]>([])
const loaded = ref(false)

let mescrollRef: MescrollInstance | undefined
let timer: ReturnType<typeof setTimeout> | undefined

const onInit = (mescroll: MescrollInstance) => {
	mescrollRef = mescroll
	onRefresh(mescroll)
}

const onRefresh = (mescroll: MescrollInstance) => {
	clearTimeout(timer)
	// 模拟请求：真实页面此处调列表接口（第一页）
	timer = setTimeout(() => {
		items.value = Array.from({ length: PAGE_SIZE }, (_, i) => i + 1)
		loaded.value = true
		mescroll.endSuccess(PAGE_SIZE, PAGE_SIZE < MAX_ITEMS)
	}, 800)
}

const onLoadMore = (mescroll: MescrollInstance) => {
	clearTimeout(timer)
	// 模拟请求：真实页面此处调列表接口（下一页）
	timer = setTimeout(() => {
		const prev = items.value.length
		const count = Math.min(prev + PAGE_SIZE, MAX_ITEMS)
		items.value = Array.from({ length: count }, (_, i) => i + 1)
		mescroll.endSuccess(count - prev, count < MAX_ITEMS)
	}, 800)
}

onUnmounted(() => clearTimeout(timer))
</script>

<style scoped lang="scss">
/* 文档地板：吸收 absolute 定位下拉指示器的溢出（组件样式契约） */
.page {
	min-height: 100vh;
	background: var(--sar-body-bg);
}

.doc,
.demo {
	padding: 0 32rpx;
}

.title {
	margin-top: 24rpx;
	font-size: var(--sar-text-lg);
	font-weight: var(--sar-font-bold);
}

.description {
	margin-top: 8rpx;
	font-size: var(--sar-text-sm);
	color: var(--sar-secondary-color);
}
</style>
