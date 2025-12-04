<template>
	<view>
		<view>1111</view>
		<KuRootView />
		<sar-notify-agent />
		<sar-toast-agent />

	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { notify } from 'sard-uniapp'

setInterval(() => {
	showNotice()
}, 2000)

const helloKuRoot = ref('Hello AppKuVue')
	const showNotice = () => {
	  notify('这是一条通知', {
	    position: 'top',
		statusBar: true
	  })
	}
</script>


<style scoped lang="scss">

</style>