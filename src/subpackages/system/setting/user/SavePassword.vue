<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<sar-input placeholder="请输入旧密码" v-model="password.oldPassword" :focus="autoFocus" root-class="rounded-input" type="password" show-eye clearable show-clear-only-focus :maxlength="30"></sar-input>
			<password-input placeholder="请输入新密码" v-model:value="password.newPassword"></password-input>
			<sar-input placeholder="请再次输入密码" v-model="password.confirmPassword" root-class="rounded-input" type="password" show-eye clearable show-clear-only-focus :maxlength="30"></sar-input>
			<sar-button round :loading="saveLoading" @click="handleSaveData">保 存</sar-button>
		</sar-space>
	</view>
</template>

<script setup lang="ts">
import {reactive, ref, nextTick, onMounted} from 'vue';
import { useUserStore } from '@/stores/user';
import router from '@/router/Router';
import {toast} from '@/utils/Toast';
import {updatePassword} from '@/api/system/profile/Profile';
import PasswordInput from '@/components/password-input/index.vue'
import { ResponseError } from '@/api/global/Type';

const userStore = useUserStore()
// 自动聚焦
const autoFocus = ref<boolean>(false)
type passwordType = {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

const password = reactive<passwordType>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saveLoading = ref<boolean>(false)

const handleSaveData = async () => {
	// 密码校验
	if (!checkPasswordData()) {
		return
	}
	// 保存密码
	try {
		saveLoading.value = true
		const resp = await userStore.updatePassword(password)
		if (resp.code === 200) {
			router.navigateBack({})
		}
	} catch(err) {
		if (err instanceof ResponseError) {
			toast((err as unknown as ResponseError).msg, 1000)
		} else {
		  console.error(err)
		}
	} finally {
		saveLoading.value = false
	}
}

// 检查密码完整性
const checkPasswordData =  () => {
	const {oldPassword, newPassword, confirmPassword} = password
	// 密码非空校验
	if (!oldPassword) {
		toast("请输入旧密码")
		return false
	}
	
	// 密码非空校验
	if (!newPassword) {
		toast("请输入新密码")
		return false
	}
	
	// 密码长度校验
	if (!(newPassword.length >= 6 && newPassword.length <= 30)) {
		toast("密码长度6-30位")
		return false
	}
	
	// 二次密码校验
	if (newPassword !== confirmPassword) {
		toast("两次密码不一致")
		return false
	}
	return true
}
onMounted(() => {
	nextTick(() => autoFocus.value = true)
})
</script>
<style lang="scss">
@import "@/static/style/input.scss";
</style>