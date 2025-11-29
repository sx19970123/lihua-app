<template>
  <view class="content" style="margin-top: 200rpx;">
    <!-- <text class="title">狸花猫后台管理系统APP</text> -->
<!-- 	<attachment-upload></attachment-upload>
	<sar-button @click="choose"> 选择文件</sar-button>
	 -->
<!-- 	<AttachmentCardList :list="fileList" fileType="file"/> -->

<attachment-upload uploadType="all"></attachment-upload>
  </view>
</template>
<script setup lang="ts">
import AttachmentUpload from '@/components/attachment-upload/index.vue';
import AttachmentCardList from '@/components/attachment-upload/AttachmentCardList.vue';
const fileList = [
	// {
	// 	url: 'https://fastly.jsdelivr.net/npm/@sard/assets/pic1.jpg',
	// 	name: 'pic1.jpg',
	// 	status: 'done',
	// },
	{
		url: 'https://fastly.jsdelivr.net/npm/@sard/assets/video/video1.mp4',
		name: 'pic1.jpg',
		status: 'done',
	}
]
const choose = () => {
	uni.chooseMessageFile({
		 count: 1, // 可选择数量
		  type: 'all',
		success: (resp) => {
			console.log("resp", resp);
		},
		
	})
}
</script>
<style lang="scss" scoped>

</style>
