<template>
	<view class="setup-step">
		<sar-icon class="setup-icon" family="icon" name="SettingOutlined" size="120rpx" color="var(--sar-primary)" />
		<text class="setup-title">欢迎使用</text>
		<text class="setup-desc">进入系统之前需要一些简单的设置，这个过程不会花费很长时间</text>
		<view class="setup-btns">
			<sar-button round @click="emit('next')">开 始</sar-button>
			<view class="setup-sub-btns">
				<sar-button type="pale-text" inline :root-style="{padding: '0'}" @click="emit('goLogin')">返回登录</sar-button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
const emit = defineEmits<{next: [], goLogin: []}>()
</script>

<style lang="scss">
@import "@/static/style/user-setup.scss";
</style>
