<template>
  <view class="content">
	  <sar-radio-group v-model="gender" @change="handleSaveData">
	    <template #custom="{toggle, value}">
	      <sar-list card>
			<!-- 选项列表 -->
	        <sar-list-item v-for="item in user_gender" :key="item.value" :title="item.label" hover @click="toggle(item.value)">
	          <template #value>
				<!-- 选中标识 -->
	            <sar-icon v-if="item.value === value" color="var(--sar-primary)" size="32rpx" name="check"/>
	          </template>
	        </sar-list-item>
	      </sar-list>
	    </template>
	  </sar-radio-group>
  </view>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { useUserStore } from '@/stores/user';
import router from '@/router/router';
import {saveBasics} from '@/api/system/profile/profile';
import {toast, toastRequestError} from '@/utils/toast';
import {initDict} from '@/helpers/dict'
const { user_gender } = initDict('user_gender')
const userStore = useUserStore()
const gender = ref<string | undefined>(userStore.userInfo.gender)
// 服务端已保存的选中值：失败回滚基准（radio v-model 已先把 UI 翻转；成功即离开页面，无需更新）
const savedGender = ref<string | undefined>(userStore.userInfo.gender)

const handleSaveData = async () => {
	// 修改逻辑（loading/toast 共用原生槽位，hideLoading 须先于任何 toast，故不收在 finally）
	try {
		uni.showLoading({title: '加载中', mask: true})
		const resp = await saveBasics({gender: gender.value})
		uni.hideLoading()
		if (resp.code === 200) {
			// 刷新store
			await userStore.initUserInfo()
			router.navigateBack({})
		} else {
			gender.value = savedGender.value
			toast(resp.msg)
		}
	} catch (err) {
		uni.hideLoading()
		gender.value = savedGender.value
		toastRequestError(err)
	}
}

</script>