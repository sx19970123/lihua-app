<template>
	<view>
		<view class="dark-font">
			暗色模式
		</view>
		<sar-button @click="gotoProfile">
			去分包
		</sar-button>
	</view>
</template>

<script setup lang="ts">
	import {test} from "@/api/test/test"
	const gotoProfile = () => {
		test().then(resp => {
			console.log(resp);
		})
		// uni.navigateTo({
		// 	url: "/subpackages/profile/Profile"
		// })
	}
</script>

<style>
	@media(prefers-color-scheme: dark) {
		.dark-font {
			color: red;
		}
	}
</style>
