<template>
	<view class="setup-step">
		<sar-icon class="setup-icon" family="icon" name="UserOutlined" size="120rpx" color="var(--sar-primary)" />
		<text class="setup-title">基础信息</text>
		<text class="setup-desc">新用户首次登录需要录入基础信息</text>
		<view class="setup-form">
			<sar-space direction="vertical" size="large">
				<sar-input placeholder="请输入用户昵称" v-model="nickname" root-class="rounded-input" :maxlength="20" clearable show-clear-only-focus />
				<sar-input placeholder="请输入手机号码（非必填）" v-model="phoneNumber" root-class="rounded-input" clearable show-clear-only-focus />
				<sar-input placeholder="请输入电子邮箱（非必填）" v-model="email" root-class="rounded-input" clearable show-clear-only-focus />
				<sar-radio-group v-model="gender" direction="horizontal">
					<sar-radio v-for="item in user_gender" :key="item.value" :value="item.value">{{item.label}}</sar-radio>
				</sar-radio-group>
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
import {ref} from 'vue'
import {toast, toastRequestError} from '@/utils/toast'
import {initDict} from '@/helpers/dict'
import {useUserStore} from '@/stores/user'
import {saveBasics} from '@/api/system/profile/profile'
import {checkPhoneNumber, checkEmail} from '@/api/system/user/user'

const emit = defineEmits<{next: [], prev: []}>()

const userStore = useUserStore()
const {user_gender} = initDict('user_gender')

const nickname = ref<string>('')
const phoneNumber = ref<string>('')
const email = ref<string>('')
// 性别默认「保密」，与 web 端向导初始值一致
const gender = ref<string>('2')

const saveLoading = ref<boolean>(false)

const handleNext = async () => {
	if (!checkBasicData()) {
		return
	}
	try {
		saveLoading.value = true
		// 选填字段唯一性实时校验（占用时后端返回 false）
		if (phoneNumber.value && !(await checkPhoneNumber(phoneNumber.value)).data) {
			toast("该手机号已存在")
			return
		}
		if (email.value && !(await checkEmail(email.value)).data) {
			toast("该邮箱已存在")
			return
		}
		const resp = await saveBasics({
			nickname: nickname.value,
			gender: gender.value,
			phoneNumber: phoneNumber.value === '' ? undefined : phoneNumber.value,
			email: email.value === '' ? undefined : email.value
		})
		if (resp.code === 200) {
			// 刷新用户信息供后续步骤（默认部门）与首页使用
			await userStore.initUserInfo()
			emit('next')
		}
	} catch (err) {
		console.error(err)
		toastRequestError(err)
	} finally {
		saveLoading.value = false
	}
}

// 表单校验（规则与 web 端向导一致：昵称必填≤20，手机/邮箱选填仅格式校验）
const checkBasicData = () => {
	if (!nickname.value) {
		toast("用户昵称不能为空")
		return false
	}

	if (phoneNumber.value && !/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
		toast("请输入正确的手机号码")
		return false
	}

	if (email.value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
		toast("请输入正确的邮箱")
		return false
	}
	return true
}
</script>

<style lang="scss">
@import "@/static/style/user-setup.scss";
@import "@/static/style/input.scss";
</style>
