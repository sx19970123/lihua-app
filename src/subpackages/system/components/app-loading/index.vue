<template>
	<view class="content">
		<sar-space direction="vertical">
			<view class="title">基础使用</view>
			<sar-space align="center">
				<app-loading/>
				<app-loading text="加载中"/>
				<app-loading text="加载中" vertical/>
			</sar-space>

			<view class="title">尺寸与描边</view>
			<sar-space align="center">
				<app-loading size="32rpx" stroke-width="3rpx"/>
				<app-loading/>
				<app-loading size="64rpx" stroke-width="6rpx"/>
				<app-loading size="88rpx" stroke-width="8rpx"/>
			</sar-space>

			<view class="title">颜色与轨道透明度</view>
			<sar-space align="center">
				<app-loading color="#3b82f6" text="主色"/>
				<app-loading color="#10b981" text="成功色"/>
				<app-loading color="#f59e0b" :track-opacity="0.5" text="轨道加深"/>
			</sar-space>

			<view class="title">暗色适配</view>
			<view class="description">默认色取 var(--sar-secondary-color)，跟随 sard 主题变量自动切换，无需手动传色。</view>
			<sar-space align="center">
				<app-loading text="跟随主题"/>
			</sar-space>

			<view class="title">JS 控制加载/关闭</view>
			<view class="description">点击按钮模拟请求，用状态切换 loading 显隐（refresh-content 首屏占位即此用法）。</view>
			<sar-button :disabled="loading" @click="startLoading">{{ loading ? '请求中…' : '开始请求' }}</sar-button>
			<view class="loading-box">
				<app-loading v-if="loading" text="正在加载…" vertical/>
				<view v-else-if="loadedOnce" class="description">请求完成（模拟数据）</view>
				<view v-else class="description">尚未请求</view>
			</view>

			<view class="title">说明</view>
			<view class="description">纯 CSS 圆环 spinner（无图片依赖），经 easycom（app-loading）直接使用；refresh-content 的下拉/上拉/首屏占位均消费本组件；支持 root-class / root-style 透传。</view>
		</sar-space>
	</view>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'

// app-loading 走 pages.json easycom 规则（^app-loading$），无需显式 import

const loading = ref(false)
const loadedOnce = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const startLoading = () => {
	loading.value = true
	timer = setTimeout(() => {
		loading.value = false
		loadedOnce.value = true
	}, 2000)
}

onUnmounted(() => clearTimeout(timer))
</script>

<style scoped lang="scss">
.title {
	font-size: var(--sar-text-lg);
	font-weight: var(--sar-font-bold);
}

.description {
	font-size: var(--sar-text-sm);
	color: var(--sar-secondary-color);
}

.loading-box {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200rpx;
	border-radius: var(--sar-rounded-lg);
	background: var(--sar-emphasis-bg);
}
</style>
