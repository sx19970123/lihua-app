<template>
	<view class="auth-body">
		<view class="auth-content" :style="{ transform: openKeyboard ? 'translateY(-30%)' : 'translateY(0)' }">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="auth-title">欢迎登录狸花猫</text>
				<!-- 断连提示与注册入口互斥单槽（防跳动行为对齐 web 端）：外层定高等于注册行，状态切换零位移 -->
				<view class="tip-slot">
					<text class="text-font err-msg" v-if="serverConnectionFailed" @click="reload">连接服务器失败，点击重试</text>
					<sar-space v-else-if="isRegistrationEnable" align="center" size="0rpx">
						<text class="text-font">没有账号？</text>
						<sar-button type="pale-text" inline root-class="text-btn" @click="toRegister">
							快速注册
						</sar-button>
					</sar-space>
				</view>
				<sar-input placeholder="用户名" v-model="loginData.username" root-class="auth-item" :class="{ 'show-caret': openKeyboard }"
					clearable show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="UserOutlined" />
					</template>
				</sar-input>

				<sar-input placeholder="密码" v-model="loginData.password" type="password" root-class="auth-item" :class="{ 'show-caret': openKeyboard }"
					clearable show-clear-only-focus>
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="LockOutlined" />
					</template>
					
				</sar-input>

				<sar-checkbox size="28rpx" v-model:checked="enableRememberMe"><text class="text-font">记住账号</text></sar-checkbox>
				<sar-button 
					root-class="auth-item auth-item-btn" 
					:loading="loginLoading"
					@click="() => isEnableCaptcha ? openCaptcha() : handleLogin()">登 录</sar-button>
			</sar-space>
		</view>

		<!-- 协议确认弹窗：APP 端 sard 弹窗不 teleport、内联渲染在此，必须排在下方 Captcha（fixed 全屏弹层）之前——
			排在 Captcha 之后会使同一渲染周期内验证码弹层挂载时其 #bg 节点量测失效（2026-09-20 对照实验证实），勿调整顺序 -->
		<sar-dialog
			v-model:visible="protocolDialogVisible"
			:headed="false"
			button-type="round"
			cancel-text="不同意"
			confirm-text="同意"
			@cancel="handleProtocolCancel"
			@confirm="handleProtocolConfirm">
			<view class="protocol-dialog-content">
				<view class="protocol-dialog-title">请同意协议</view>
				<sar-space root-class="protocol-dialog-desc" align="center" justify="center" size="0rpx" wrap>
					<text>我已阅读并同意</text>
					<sar-button type="pale-text" inline root-class="text-btn" :root-style="{'padding': '0'}" @click="toUserAgreement">用户协议</sar-button>
					<text>与</text>
					<sar-button type="pale-text" inline root-class="text-btn" :root-style="{'padding': '0'}" @click="toPrivacyPolicy">隐私政策</sar-button>
				</sar-space>
			</view>
		</sar-dialog>

		<!-- 用户协议，键盘弹起后隐藏 -->
		<view class="auth-protocol" v-if="!openKeyboard">
			<sar-space align="center" size="0rpx">
				<sar-checkbox type="circle" v-model:checked="checkProtocol" @change="cacheProtocol">我已阅读并同意</sar-checkbox>
				<sar-button type="pale-text" inline root-class="text-btn" @click="toUserAgreement">用户协议</sar-button>
				与
				<sar-button type="pale-text" inline root-class="text-btn" @click="toPrivacyPolicy">隐私政策</sar-button>
			</sar-space>
		</view>
		<!-- 验证码 -->
		<Captcha @success="handleLogin" ref="captchaRef" v-if="isEnableCaptcha"/>
	</view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSettingStore } from '@/stores/setting'
import type { LoginType } from '@/api/system/authentication/type/login-type'
import router from '@/router/router'
import Captcha from '@/components/captcha/index.vue'
import {toast} from '@/utils/toast'
import { useKeyboardStatus } from '@/composables/use-keyboard-status'

const settingStore = useSettingStore()
import {rememberMe, getRememberedInfo} from '@/helpers/remember'
import {setToken} from '@/helpers/token'
import {login} from "@/api/system/authentication/authentication";
const captchaRef = ref<InstanceType<typeof Captcha>>()
const serverConnectionFailed = ref<boolean>(false)
type ProtocolPendingAction = (() => void | Promise<void>) | null

/**
 * 初始化登录相关
 */
const initLogin = () => {
	// 用户登录数据
	const loginData = ref<LoginType>({username: '', password: ''})
	// 登录loading
	const loginLoading = ref<boolean>(false)
	
	// 检查登录信息是否填写完整
	const checkLoginData = (afterAgree?: () => void | Promise<void>) => {
		const data = loginData.value

		if (!data.username) {
			toast("请输入用户名")
			return false
		}

		if (!data.password) {
			toast("请输入密码")
			return false
		}

		if (!checkProtocol.value) {
			openProtocolDialog(afterAgree)
			return false
		}

		return true
	}
	
	// 用户登录
	const handleLogin = async (captchaVerification?: string) => {
		// 检查表单是否填写完整
		if (!checkLoginData(() => handleLogin(captchaVerification))) {
			return
		}
		
		try {
			loginLoading.value = true
      loginData.value.captchaVerification = captchaVerification
			const resp = await login(loginData.value)
			// 登录成功
			if (resp.code === 200) {
				setToken(resp.data)
				// 处理记住账号
				handleRememberMe()
				// 跳转至首页
				router.reLaunch({
					url: "/pages/index/index"
				})
			} else {
				toast(resp.msg)
			}
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
	// 是否启用验证码（取自设置 store）
	const isEnableCaptcha = computed(() => settingStore.enableCaptcha)

	// 拉取基础设置（验证码/注册开关），失败置连接失败态供重试
	const captcha = async () => {
		try {
			await settingStore.initBaseSetting()
			serverConnectionFailed.value = false
		} catch(err) {
			serverConnectionFailed.value = true
		}
	}
	
	// 打开验证码
	const openCaptcha = () => {
		// 检查表单是否填写完整
		if (!checkLoginData(() => openCaptcha())) {
			return
		}
		// 打开验证码
		const ref = captchaRef.value
		if (ref) {
			ref.open()
		}
	}
	
	return {
		isEnableCaptcha,
		captcha,
		openCaptcha
	}
}

const {isEnableCaptcha, captcha, openCaptcha} = initCaptcha()


/**
 * 初始化记住我相关
 */
const initRememberMe = () => {
	// 是否启用记住我
	const enableRememberMe = ref<boolean>(false)
	// 获取记住我信息
	const initRememberMeInfo = () => {
		const rememberedInfo = getRememberedInfo()
		if (rememberedInfo) {
			enableRememberMe.value = true
			loginData.value = rememberedInfo
		} else {
			enableRememberMe.value = false
		}
	}
	// 处理记住我
	const handleRememberMe = () => {
		const {username, password} = loginData.value
		rememberMe(enableRememberMe.value, username, password)
	}
	
	return {
		enableRememberMe,
		initRememberMeInfo,
		handleRememberMe
	}
}

const {enableRememberMe, initRememberMeInfo, handleRememberMe} = initRememberMe()


/**
 * 初始化用户协议相关
 */
const initProtocol = () => {
	// 缓存key常量
	const key = "lihua_protocol"

	// 检查用户协议
	const checkProtocol = ref<boolean>(false)

	// 用户协议弹窗
	const protocolDialogVisible = ref<boolean>(false)
	let pendingProtocolAction: ProtocolPendingAction = null

	// 缓存用户协议勾选状态
	const cacheProtocol = () => {
		if (checkProtocol.value) {
			uni.setStorageSync(key, checkProtocol.value)
		} else {
			uni.removeStorageSync(key)
		}
	}

	// 回显用户协议勾选状态
	const initProtocolStatus = () => {
		checkProtocol.value = !!uni.getStorageSync(key)
	}

	// 打开协议确认弹窗，并记录确认后需要继续执行的动作
	const openProtocolDialog = (action?: () => void | Promise<void>) => {
		pendingProtocolAction = action || null
		protocolDialogVisible.value = true
	}

	// 取消协议确认
	const handleProtocolCancel = () => {
		pendingProtocolAction = null
		protocolDialogVisible.value = false
	}

	// 同意协议后继续执行触发弹窗前的操作
	const handleProtocolConfirm = () => {
		checkProtocol.value = true
		cacheProtocol()
		protocolDialogVisible.value = false

		const action = pendingProtocolAction
		pendingProtocolAction = null
		if (action) {
			void action()
		}
	}

	return {
		checkProtocol,
		cacheProtocol,
		protocolDialogVisible,
		openProtocolDialog,
		handleProtocolCancel,
		handleProtocolConfirm,
		initProtocolStatus
	}
}

const {
	checkProtocol,
	protocolDialogVisible,
	openProtocolDialog,
	handleProtocolCancel,
	handleProtocolConfirm,
	cacheProtocol,
	initProtocolStatus
} = initProtocol()

/**
 * 用户注册相关
 */
// 是否启用用户注册（取自设置 store）
const isRegistrationEnable = computed(() => settingStore.enableSignUp)

/**
 * 初始化键盘监听（公共 composable，onShow/onHide 注册在其内）
 */
const {openKeyboard} = useKeyboardStatus()


// 前往注册
const toRegister = () => {
	if (!checkProtocol.value) {
		openProtocolDialog(toRegister)
		return
	}
	openKeyboard.value = false
	router.navigateTo({
		url: "/pages/login/Register?enableCaptcha=" + isEnableCaptcha.value,
		animationType: "slide-in-bottom"
	})
}

// 前往隐私政策
const toPrivacyPolicy = () => {
	router.navigateTo({
		url: "/subpackages/system/protocol/PrivacyPolicy",
	})
}

// 前往用户协议
const toUserAgreement = () => {
	router.navigateTo({
		url: "/subpackages/system/protocol/UserAgreement",
	})
}

/**
 * 监听注册成功返回数据
 */
const onRegisterSuccess = (username: string) => {
	loginData.value = {username, password: ''}
	rememberMe(false)
	enableRememberMe.value = false
	nextTick(() => toast("注册成功，用户名已自动代入", 2500))
}

const reload = () => {
	uni.$off('registerSuccess', onRegisterSuccess)
	captcha()
	initRememberMeInfo()
	initProtocolStatus()
	uni.$on('registerSuccess', onRegisterSuccess)
}

onMounted(() => {
	reload()
})

onUnmounted(() => {
	uni.$off('registerSuccess', onRegisterSuccess)
})
</script>

<style lang="scss">
@import "@/static/style/auth.scss";
.protocol-dialog-content {
	padding: 8rpx 32rpx 28rpx;
	text-align: center;
}
.protocol-dialog-title {
	color: var(--sar-emphasis-color);
	margin-top: 40rpx;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 48rpx;
}
.protocol-dialog-desc {
	margin-top: 18rpx;
	color: var(--sar-tertiary-color);
	font-size: 28rpx;
	line-height: 40rpx;
}
/* 互斥槽定高等于注册行（sar-button 默认高）：皆隐藏时保留空槽，断连↔注册切换零位移 */
.tip-slot {
	height: var(--sar-button-height);
	display: flex;
	align-items: center;
}

.err-msg {
	color: var(--sar-danger);
}
</style>
