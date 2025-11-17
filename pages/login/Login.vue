<template>
	<view class="login-body">
		<view class="login-content" :style="{ transform: openKeyboard ? 'translateY(-30%)' : 'translateY(0)' }">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="login-title">欢迎登录狸花猫</text>
				<sar-space align="center" size="0rpx">
					<text class="text-font">没有账号？</text>
					<sar-button type="pale-text" inline root-class="text-btn" @click="toRegister">
						快速注册<sar-icon name="right" />
					</sar-button>
				</sar-space>

				<sar-input placeholder="用户名" v-model="loginData.username" root-class="login-item" :class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="user" />
					</template>
				</sar-input>

				<sar-input placeholder="密码" v-model="loginData.password" type="password" root-class="login-item" :class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock" />
					</template>
				</sar-input>

				<sar-checkbox size="28rpx"><text class="text-font">记住账号</text></sar-checkbox>
				<sar-button 
					root-class="login-item login-item-btn" 
					:loading="loginLoading"
					@click="() => enableCaptcha ? openCaptcha() : handleLogin()">登 录</sar-button>
			</sar-space>
		</view>

		<!-- 用户协议，键盘弹起后隐藏 -->
		<view class="protocol" v-if="!openKeyboard">
			<sar-space align="center" size="0rpx">
				<sar-checkbox type="circle">我已阅读并同意</sar-checkbox>
				<sar-button type="pale-text" inline root-class="text-btn">用户协议</sar-button>
				与
				<sar-button type="pale-text" inline root-class="text-btn">隐私政策</sar-button>
			</sar-space>
		</view>
		<Captcha @success="handleLogin" ref="captchaRef" v-if="enableCaptcha"/>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { enable } from '@/api/system/captcha/Captcha'
import type { LoginType } from '@/api/system/login/type/LoginType'
import { useUserStore } from '@/stores/user'
import router from '@/router/Router'
import Captcha from '@/components/captcha/index'
import {toast} from '@/utils/Toast'
const userStore = useUserStore()
const captchaRef = ref<InstanceType<typeof Captcha>>()

// 前往注册
const toRegister = () => {
	router.navigateTo({
		url: "/pages/login/Register"
	})
}

/**
 * 初始化登录相关
 */
const initLogin = () => {
	// 用户登录数据
	const loginData = ref<LoginType>({username: '', password: ''})
	// 登录loading
	const loginLoading = ref<boolean>(false)
	
	// 检查登录信息是否填写完整
	const checkLoginData = () => {
		const data = loginData.value
		
		if (!data.username) {
			toast("请输入用户名")
			return false
		}
		
		if (!data.password) {
			toast("请输入密码")
			return false
		}
		
		return true
	}
	
	// 用户登录
	const handleLogin = async (captchaId?: string) => {
		// 检查表单填写是否完整
		if (!checkLoginData()) {
			return
		}
		
		try {
			loginLoading.value = true
			const data = loginData.value as LoginType
			const resp = await userStore.login(data.username, data.password, captchaId)
			// 登录成功
			if (resp.code === 200) {
				// 跳转至首页
				router.reLaunch({
					url: "/pages/index/index"
				})
			} else {
				toast(resp.msg)
			}
		} catch(err) {
			console.error(err)
		} finally {
			loginLoading.value = false
		}
	}
	
	return {
		loginData,
		loginLoading,
		checkLoginData,
		handleLogin
	}
}

const {loginData, loginLoading, checkLoginData, handleLogin} = initLogin()

/**
 * 初始化验证码相关
 */
const initCaptcha = () => {
	// 是否启用验证码
	const enableCaptcha = ref<boolean>(false)
	
	// 是否启用验证码
	const captcha = async () => {
		const resp = await enable()
		if (resp.code === 200) {
			enableCaptcha.value = resp.data
		} else {
			toast(resp.msg)
		}
	}
	
	// 打开验证码
	const openCaptcha = () => {
		// 检查表单填写是否完整
		if (!checkLoginData()) {
			return
		}
		console.log("进来了")
		// 打开验证码
		const ref = captchaRef.value
		if (ref) {
			ref.open()
		}
	}
	
	return {
		enableCaptcha,
		captcha,
		openCaptcha
	}
}

const {enableCaptcha, captcha, openCaptcha} = initCaptcha()

/**
 * 初始化键盘监听
 */
const initKeyboardStatus = () => {
	// 控制键盘弹起状态
	const openKeyboard = ref<boolean>(false)
	// 键盘高度变化监听
	const handleChangeKeyboardHeight = (data : UniNamespace.OnKeyboardHeightChangeResult) => {
		openKeyboard.value = data.height > 0
	}
	
	return {
		openKeyboard,
		handleChangeKeyboardHeight
	}
}

const {openKeyboard, handleChangeKeyboardHeight} = initKeyboardStatus()

onMounted(() => {
	uni.onKeyboardHeightChange(handleChangeKeyboardHeight)
	captcha()
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