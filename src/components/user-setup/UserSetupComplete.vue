<template>
	<view class="setup-step">
		<sar-icon class="setup-icon" family="icon" name="CheckCircleOutlined" size="120rpx" color="var(--sar-primary)" />
		<text class="setup-title">完 成</text>
		<text class="setup-desc">一切就绪！点击下方按钮进入系统。</text>
		<view class="setup-btns">
			<sar-button round @click="emit('complete')">进入系统</sar-button>
		</view>
	</view>
</template>

<script setup lang="ts">
const emit = defineEmits<{complete: []}>()
</script>

<style lang="scss">
@import "@/static/style/user-setup.scss";
</style>
