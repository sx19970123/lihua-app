<template>
	<view class="content">
		<sar-list card>
			<sar-list-item title="附件上传" arrow hover @click="goComponentPage('attachment')"></sar-list-item>
			<sar-list-item title="颜色选择" arrow hover @click="goComponentPage('color-select')"></sar-list-item>
			<sar-list-item title="字典标签" arrow hover @click="goComponentPage('dict-tag')"></sar-list-item>
			<sar-list-item title="图标选择" arrow hover @click="goComponentPage('icon-select')"></sar-list-item>
			<sar-list-item title="消息通知（原生）" arrow hover @click="goComponentPage('notice')"></sar-list-item>
		</sar-list>
	</view>
</template>

<script setup lang="ts">
import router from '@/router/Router'
const goComponentPage = (pageName: string) => {
	const baseURL = "/subpackages/system/components/"
	router.navigateTo({
		url: baseURL + pageName + '/index'
	})
}
</script>