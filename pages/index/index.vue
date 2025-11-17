<template>
	<view class="dark-font">
		<sar-button @click="handleLogout">
			退出登录
		</sar-button>
	</view>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted} from "vue"
import { useUserStore } from "@/stores/user";
const userStore = useUserStore()
const handleLogout = () => {
	userStore.handleLogout()
}

onMounted(() => {
	console.log("userStore.userInfo", userStore.userInfo);
})

</script>

<style>
	@media(prefers-color-scheme: dark) {
		.dark-font {
			color: red;
		}
	}
</style>
