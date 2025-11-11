<template>
	<view class="dark-font">
		<sar-button @click="gotoProfile">
			登录
		</sar-button>
		<captcha ref="captchaRef" @success="handleSuccess"/>
	</view>
</template>

<script setup lang="ts">
import {ref} from "vue"
import Captcha from '@/components/captcha/index.vue'
const captchaRef = ref<InstanceType<typeof Captcha>>()
const gotoProfile = () => {
	if (captchaRef.value) {
		captchaRef.value.open()
	}
}
const handleSuccess = (id: string) => {
	console.log("成功", id)
}
</script>

<style>
	@media(prefers-color-scheme: dark) {
		.dark-font {
			color: red;
		}
	}
</style>
