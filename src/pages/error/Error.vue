<template>
	<view class="error-page" :class="{ 'theme-dark': themeStore.isDark }">
		<image class="error-image" :src="imageUrl" mode="widthFix"></image>
		<view class="error-title">{{ errorContent.title }}</view>
		<view class="error-desc">{{ errorContent.desc }}</view>
		<!-- 451 是 IP 级封锁，回首页后所有请求仍会 451 被弹回本页，不提供出口按钮 -->
		<sar-button v-if="errorType !== '451'" round inline :root-style="{padding: '0 64rpx'}" @click="toIndex">回到首页</sar-button>
	</view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import router from '@/router/router'

const themeStore = useThemeStore()

// 错误类型（403 无权限 / 404 页面不存在 / 451 IP 限制），文案与插画与 lihua-web 端错误页同源
const ERROR_CONTENT: Record<string, { title: string, desc: string }> = {
	'403': { title: '403 Forbidden Access', desc: '您没有权限访问此页面' },
	'404': { title: '404 Not Found', desc: '页面不见了' },
	'451': { title: 'Service to the area is temporarily unavailable', desc: '暂时无法为该地区提供服务' }
}
const errorType = ref<string>('404')

onLoad((options) => {
	if (options?.type && ERROR_CONTENT[options.type]) {
		errorType.value = options.type
	}
})

const errorContent = computed(() => ERROR_CONTENT[errorType.value])

// 亮色 miao / 暗色 hei 双插画，随主题即时切换（与首页 logo 徽章同机制）
const imageUrl = computed(() => {
	return `/static/error/${errorType.value}-${themeStore.isDark ? 'hei' : 'miao'}.png`
})

// 错误页由 reLaunch 进入（栈已清空），必须留出口；经 router 守卫回到首页（未登录会被引导至登录页）
const toIndex = () => {
	router.reLaunch({
		url: '/pages/index/index'
	})
}
</script>

<style lang="scss">
.error-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	gap: 32rpx;
		height: 100vh;
		padding-top: 20vh;
	box-sizing: border-box;
	text-align: center;
	background-color: #f7f7f8;

	&.theme-dark {
		background-color: #000000;
	}

	.error-image {
		// widthFix 模式按宽度等比缩放，高度自适应各插画不同的宽高比
		// （uni 的 image 为自定义元素内嵌 width:100% 的 img，width 不能用 auto，会塌缩为 0）
		width: 160rpx;
	}

	.error-title {
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.88);
	}

	.error-desc {
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.45);
		margin-bottom: 32rpx;
	}

	&.theme-dark .error-title {
		color: rgba(255, 255, 255, 0.88);
	}

	&.theme-dark .error-desc {
		color: rgba(255, 255, 255, 0.45);
	}
}
</style>