<template>
	<view class="auth-body">
		<view class="auth-content" :style="{ transform: openKeyboard ? 'translateY(-30%)' : 'translateY(0)' }">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="auth-title">欢迎注册狸花猫</text>
				<sar-space align="center" size="0rpx">
					<text class="text-font">已有账号？</text>
					<sar-button type="pale-text" inline root-class="text-btn" @click="router.navigateBack()">
						返回登录
					</sar-button>
				</sar-space>

				<sar-input 
					placeholder="用户名" 
					root-class="auth-item" 
					:class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus
				>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="user" />
					</template>
				</sar-input>

				<sar-input 
					placeholder="密码" 
					type="password" 
					root-class="auth-item" 
					:class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus
				>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock" />
					</template>
				</sar-input>

				<sar-input 
					placeholder="再次输入" 
					type="password" 
					root-class="auth-item" 
					:class="{ 'show-caret': openKeyboard }"
					show-clear-only-focus
				>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock" />
					</template>
				</sar-input>
				
				<sar-button 
					root-class="auth-item auth-item-btn" 
					:loading="loginLoading"
					@click="() => enableCaptcha ? openCaptcha() : handleLogin()">注 册</sar-button>
			</sar-space>
		</view>
		
		<!-- 验证码 -->
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
import {onShow, onHide} from "@dcloudio/uni-app"

const userStore = useUserStore()
const captchaRef = ref<InstanceType<typeof Captcha>>()


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
	captcha()
})

onShow(() => {
	uni.onKeyboardHeightChange(handleChangeKeyboardHeight)
})

onHide(() => {
	uni.offKeyboardHeightChange(handleChangeKeyboardHeight)
})
</script>

<style lang="scss">
@import "@/assets/style/auth.scss";
</style>