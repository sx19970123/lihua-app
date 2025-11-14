<template>
	<view class="login-body">
		<view class="login-content" :style="{ transform: openKeyboard ? 'translateY(-30%)' : 'translateY(0)' }">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="login-title">欢迎注册狸花猫</text>
				<!-- 输入框 -->
				<sar-input placeholder="用户名" root-class="login-item" :class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="user" />
					</template>
				</sar-input>

				<sar-input placeholder="密码" root-class="login-item" :class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock" />
					</template>
				</sar-input>
				
				<sar-input placeholder="再次输入" root-class="login-item" :class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock" />
					</template>
				</sar-input>
				
				<sar-button root-class="login-item login-item-btn">登 录</sar-button>
			</sar-space>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 控制键盘弹起状态
const openKeyboard = ref(false)

const handleChangeKeyboardHeight = (data : UniNamespace.OnKeyboardHeightChangeResult) => {
	openKeyboard.value = data.height > 0
}

onMounted(() => {
	uni.onKeyboardHeightChange(handleChangeKeyboardHeight)
})

onUnmounted(() => {
	uni.offKeyboardHeightChange(handleChangeKeyboardHeight)
})
</script>

<style lang="scss">
page {
	/* 页面固定不出现滚动条 */
	position: fixed;
	overflow: hidden;
}

.login-body {
	padding: 48rpx;
	margin-top: 40%;

	.login-title {
		font-size: 48rpx;
		margin-bottom: 32rpx;
		font-weight: bold;
		line-height: 40rpx;
	}

	.login-item {
		height: 90rpx;
		border-radius: 24rpx;
		caret-color: transparent;
		transition: caret-color 0.3s linear;
	}

	.login-item.show-caret {
		caret-color: var(--sar-primary-text);
	}

	.login-item-btn {
		margin-top: 64rpx;
	}

	.protocol {
		position: fixed;
		bottom: 64rpx;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		color: var(--sar-tertiary-color);
	}

	.text-btn {
		padding: 0 !important;
	}

	.text-font {
		font-size: var(--sar-text-base);
	}
	
	/* app 中输入框弹出动画 */
	/* #ifdef APP-PLUS */
	.login-content {
		width: 100%;
		transition: transform 0.3s ease;
	}
	/* #endif */
}
</style>