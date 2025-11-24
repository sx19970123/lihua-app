<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<sar-input placeholder="请输入昵称" v-model="nickName" root-class="rounded-input" clearable show-clear-only-focus :maxlength="20"></sar-input>
			<sar-button round :loading="saveLoading" @click="handleSaveData">保 存</sar-button>
		</sar-space>
	</view>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { useUserStore } from '@/stores/user';
import router from '@/router/Router';
import {saveBasics} from '@/api/system/profile/Profile';
import {toast} from '@/utils/Toast';

const userStore = useUserStore()
const nickName = ref<string>(userStore.$state.nickname)
const saveLoading = ref<boolean>(false)

const handleSaveData = async () => {
	// 输入校验
	if (!nickName.value) {
		toast("请输入用户名")
		return
	}
	// 值未修改
	if (nickName.value === userStore.$state.nickname) {
		router.navigateBack({})
		return
	}
	// 修改逻辑
	try {
		saveLoading.value = true
		const resp = await saveBasics({nickname: nickName.value})
		if (resp.code === 200) {
			// 刷新store
			await userStore.initUserInfo()
			toast("保存成功", 1000)
			setTimeout(() => {
				// 返回上一级
				router.navigateBack({})
			}, 1000)
		} else {
			toast(resp.msg)
		}
	} catch(e) {
		console.error(e)
	} finally {
		saveLoading.value = false
	}
}

</script>
<style scoped lang="scss">
@import "@/static/style/input.scss";
</style>