<template>
	<view v-if="avatarData">
		<!-- 图片类型 -->
		<sar-avatar v-if="avatarData.type === 'image'" :src="avatarData.url"/>
		<!-- 文本|图标类型 -->
		<sar-avatar v-else :background="avatarData.backgroundColor">
			<sar-icon v-if="avatarData.type === 'icon'" family="icon" :name="avatarData.value" />
			<text v-else>{{avatarData.value}}</text>
		</sar-avatar>
	</view>
	<!-- 默认头像 -->
	<sar-avatar v-else />
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import type {AvatarType} from "@/api/system/profile/type/AvatarType"
import {useUserStore} from "@/stores/user"
const userStore = useUserStore()
const avatarData = ref<AvatarType>()

onMounted(() => {
	avatarData.value = userStore.avatar
	if (avatarData.value.backgroundColor?.includes('conic-gradient')) {
		avatarData.value.backgroundColor = 'var(--sar-primary)'
	}
})

</script>

<style>
</style>