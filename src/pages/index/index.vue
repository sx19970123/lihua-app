<template>
  <view class="content" style="margin-top: 200rpx;">
    <!-- <text class="title">狸花猫后台管理系统APP</text> -->
<!-- 	<attachment-upload></attachment-upload>
	<sar-button @click="choose"> 选择文件</sar-button>
	 -->
<!-- 	<AttachmentCardList :list="fileList" fileType="file"/> -->

	<attachment-upload v-model="fileValue" model="button" uploadType="all" :max-count="3" businessCode="app-test" businessName="app-开发测试"></attachment-upload>
  </view>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue'
import AttachmentUpload from '@/components/attachment-upload/index.vue';
import AttachmentCardList from '@/components/attachment-upload/AttachmentCardList.vue';

const fileValue = ref<string>()

setTimeout(() => {
	fileValue.value = '1995075556339245057,1995075687574822913,1995085859131191297'
}, 200)

const choose = () => {
	uni.chooseMessageFile({
		 count: 1, // 可选择数量
		  type: 'all',
		success: (resp) => {
			console.log("resp", resp);
		},
		
	})
}

watch(() => fileValue.value, ()=> {
	console.log("双向绑定", fileValue.value);
})
</script>
<style lang="scss" scoped>

</style>
