<template>
	<sar-button @click="show" style="margin-top: 300px;"> 显示</sar-button>
	<sar-button @click="MessageNotify.hide()"> 隐藏</sar-button>
</template>

<script setup lang="ts">
import MessageNotify from '@/utils/MessageNotify'
import { toast } from '@/utils/Toast';
const show = () => {
	MessageNotify.show({title: '点击通知', content: '点击通知内容', duration: 3000000}, () => {
		toast("点击了")
	}, (direction) => {
		toast("滑动方向" + direction)
	})
}
</script>
