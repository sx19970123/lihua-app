<template>
	<view>
		<KuRootView />
		<!-- 通知代理组件 -->
		<sar-notify-agent />
		<!-- 模态框代理组件 -->
		<sar-dialog-agent />
		<!-- 裁剪组件代理 -->
		<sar-crop-image-agent />
	</view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useNoticeStore } from '@/stores/notice'
const noticeStore = useNoticeStore()
/**
 * 根节点组件生命周期函数，在页面生命周期函数之前触发，避免处理复杂逻辑，详见：
 * https://uni-ku.js.org/projects/root/features#%E5%8A%9F%E8%83%BD%E4%BA%94%E4%B8%8E-uniapp-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%9B%86%E6%88%90
 */
onShow(() => {
	noticeStore.setTabbarRedDot()
})
</script>