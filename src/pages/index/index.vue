<template>
	<sar-button @click="MessageNotify.show()" style="margin-top: 300px;"> 显示</sar-button>
	<sar-button @click="MessageNotify.hide()"> 隐藏</sar-button>
</template>

<script setup lang="ts">
import MessageNotify from '@/utils/MessageNotify'
</script>
