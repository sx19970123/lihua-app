<template>
	<!-- 上传附件类型为 image 或 video 并设置为按钮模式 -->
	<sar-upload v-model="fileList"
		:after-read="afterRead" 
		:accept="props.uploadType" 
		:max-count="props.maxCount" 
		:max-size="maxSize" 
		:disabled="props.disabled"
		:readonly="props.readonly"
		:removable="props.removable"
		v-if="props.uploadType !== 'file' && props.uploadType !== 'all' && props.model === 'button'">
		<template #default="{list, onSelect, onRemove, onImageClick}">
			<sar-space direction="vertical">
				<sar-button @click="onSelect" v-if="!props.readonly && !props.disabled">点击上传</sar-button>
				<attachment-card-list 
					:fileType="props.uploadType" 
					:list="list" 
					:disabled="props.disabled"
					:readonly="props.readonly"
					:removable="props.removable"
					@delete="onRemove" 
					@clickImage="onImageClick"/>
			</sar-space>
		</template>
	</sar-upload>
	
	<!-- 上传附件类型为 image 或 video 并设置为图片模式 -->
	<sar-upload v-model="fileList" 
		:after-read="afterRead" 
		:accept="props.uploadType" 
		:max-count="props.maxCount" 
		:max-size="maxSize" 
		:disabled="props.disabled"
		:readonly="props.readonly"
		:removable="props.removable"
		v-if="props.uploadType !== 'file' && props.uploadType !== 'all' && props.model === 'picture'"/>
	
	<!-- 上传附件类型不为image和video，需自行实现，只能以按钮形式上传（仅微信小程序支持） -->
	<sar-space direction="vertical" v-if="props.uploadType === 'file' || props.uploadType === 'all'">
		<sar-button v-if="!props.readonly && !props.disabled" @click="handleMessageChoose">点击上传</sar-button>
		<attachment-card-list
			fileType="file" 
			:list="fileList"
			:disabled="props.disabled"
			:readonly="props.readonly"
			:removable="props.removable"
			@clickImage="handleWechatImgPreview"
		/>
	</sar-space>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'
import type { UploadFileItem } from 'sard-uniapp'
import AttachmentCardList from '@/components/attachment-upload/AttachmentCardList.vue';
import {toast} from '@/utils/Toast';

// 传入参数
const props = withDefaults(defineProps<{
	// 双向绑定
	value?: string,
	// 类型
	model: 'button' | 'picture',
	// 可上传的附件类型（设置为file会从微信聊天中选取文件，仅微信小程序支持）
	uploadType?: 'image' | 'video' | 'file' | 'all',
	// 包含的文件后缀，仅 uploadType === file 时生效
	extension?: string[],
	// 文件上传限制的数量
	maxCount: number,
	// 文件上传大小限制
	maxSize: number,
	// 禁用状态
	disabled: boolean,
	// 只读状态
	readonly: boolean,
	// 可否删除
	removable: boolean
}>(), {
	model: 'picture',
	uploadType: 'image',
	maxCount: 10,
	maxSize: 2 * 1024 * 1024,
	disabled: false,
	readonly: false,
	removable: true
})

// 附件列表
const fileList = ref<UploadFileItem[]>([])

// 前置上传
const afterRead = (fileItem : UploadFileItem) => {
	fileItem.status = 'uploading'
	fileItem.message = '正在上传'
	fileItem.url = fileItem?.file?.path || fileItem.url
	fileList.value.push(fileItem)

	setTimeout(() => {
		fileItem.status = 'done'
		fileList.value = [...fileList.value]
	}, 1500)
}

// 微信消息文件选择
const handleMessageChoose = () => {
	uni.chooseMessageFile({
		count: props.maxCount,
		type: props.uploadType,
		extension: props.extension,
		success: ({ tempFiles }: { tempFiles: { path: string; name: string; size: number, type: string }[] }) => {
			tempFiles.forEach(file => {
				const {size, path, name, type} = file
				if (size > props.maxSize) {
					toast("上传失败，附件不能超过" + (props.maxSize / 1024 / 1024) + "MB")
				} else {
					afterRead({url: path, name: name, type: type})
				}
			})
		}
	})
}

// 处理微信图片预览
const handleWechatImgPreview = (index: number) => {
	// 过滤image
	const urls = fileList.value.filter(item => item.type === 'image').map(item => item.url)
	// 预览
	uni.previewImage({
		current: index,
		urls: urls
	})
}
</script>