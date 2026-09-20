<template>
	<view class="setup-step">
		<sar-icon class="setup-icon" family="icon" name="LockOutlined" size="120rpx" color="var(--sar-primary)" />
		<text class="setup-title">安全</text>
		<text class="setup-desc">为了确保您的账号安全，请修改密码</text>
		<view class="setup-form">
			<sar-space direction="vertical" size="large">
				<sar-input placeholder="请输入旧密码" v-model="password.oldPassword" type="password" root-class="rounded-input" show-eye clearable show-clear-only-focus :maxlength="30" />
				<password-input placeholder="请输入新密码" v-model:value="password.newPassword" />
				<sar-input placeholder="请再次输入密码" v-model="password.confirmPassword" type="password" root-class="rounded-input" show-eye clearable show-clear-only-focus :maxlength="30" />
			</sar-space>
		</view>
		<view class="setup-btns">
			<sar-button round :loading="saveLoading" @click="handleNext">下一步</sar-button>
			<view class="setup-sub-btns">
				<sar-button type="pale-text" inline :root-style="{padding: '0'}" @click="emit('prev')">上一步</sar-button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {toast, toastRequestError} from '@/utils/toast'
import PasswordInput from '@/components/password-input/index.vue'
import type {passwordType} from '@/api/system/profile/type/password-type'
import {updatePassword} from '@/api/system/profile/profile'
import {updateRememberedPassword} from '@/helpers/remember'

const emit = defineEmits<{next: [], prev: []}>()

const password = reactive<passwordType>({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

const saveLoading = ref<boolean>(false)

const handleNext = async () => {
	if (!checkPasswordData()) {
		return
	}
	try {
		saveLoading.value = true
		const resp = await updatePassword(password)
		if (resp.code === 200) {
			// 改密成功后同步记住的密码，避免下次自动填充旧密码
			updateRememberedPassword(password.newPassword)
			emit('next')
		}
	} catch (err) {
		console.error(err)
		toastRequestError(err)
	} finally {
		saveLoading.value = false
	}
}

// 密码完整性校验（规则与设置页改密一致）
const checkPasswordData = () => {
	const {oldPassword, newPassword, confirmPassword} = password

	if (!oldPassword) {
		toast("请输入旧密码")
		return false
	}

	if (!newPassword) {
		toast("请输入新密码")
		return false
	}

	if (!(newPassword.length >= 6 && newPassword.length <= 30)) {
		toast("密码长度6-30位")
		return false
	}

	if (newPassword !== confirmPassword) {
		toast("两次密码不一致")
		return false
	}
	return true
}
</script>

<style lang="scss">
@import "@/static/style/user-setup.scss";
@import "@/static/style/input.scss";
</style>
