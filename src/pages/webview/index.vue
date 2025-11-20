<template>
	<web-view :src="url"></web-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue';

const url = ref<string>('')

onLoad(options => {
	url.value = decodeURIComponent(options.url)
})
</script>
