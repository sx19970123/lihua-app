<template>
	<!-- #ifndef H5 -->
	<web-view :src="url"></web-view>
	<!-- #endif -->
	<!-- #ifdef H5 -->
	<view class="webview-h5">
		<text class="webview-h5__text">外部链接需在浏览器中打开</text>
		<button class="webview-h5__btn" v-if="fallbackVisible" @click="openExternal">前往外部链接</button>
	</view>
	<!-- #endif -->
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue';

const url = ref<string>('')

// #ifdef H5
const fallbackVisible = ref(false)

const openExternal = () => {
	window.location.href = url.value
}
// #endif

onLoad(options => {
	if (options) {
		url.value = decodeURIComponent(options.url)
		// #ifdef H5
		// gitee 等外链带 X-Frame-Options，iframe 嵌套必被拒（H-10 实测），
		// H5 端改新窗口直跳；被弹窗拦截时展示手动跳转按钮
		const opened = window.open(url.value, '_blank')
		if (opened) {
			uni.navigateBack()
		} else {
			fallbackVisible.value = true
		}
		// #endif
	}
})
</script>

<style scoped>
.webview-h5 {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 120rpx;
}

.webview-h5__text {
	color: #666;
	font-size: 28rpx;
}

.webview-h5__btn {
	margin-top: 32rpx;
	font-size: 28rpx;
}
</style>
