<template>
	<sar-space direction="vertical">
		<sar-list v-for="(item, index) in props.list" :key="item.name + index" card>
			<sar-list-item>
				<!-- 左侧内容 -->
				<template #title>
					<sar-space align="center">
						<!-- 图片封面 -->
						<image v-if="props.fileType === 'image' || item.type === 'image'" mode="aspectFill" :src="item.url" class="file-item" @click="handleClickImage(index, item)"/>
						<!-- 视频封面 -->
						<video v-if="props.fileType === 'video' || item.type === 'video'" :src="item.url" class="file-item" controls @click="handleClickVideo(index, item)"/>
						<!-- 文件名称 -->
						<sar-button v-if="props.fileType === 'file' || item.type === 'file'" type="pale-text" class="file-item" inline @click="handleClickFile(index, item)">{{item.name}}</sar-button>
						<!-- 附件名称（file类型不显示） -->
						<text v-if="props.fileType !== 'file' && item.type !== 'file'" class="file-name" style="max-width: 50vw;" @click="handleClickFileName(index, item)">{{item.name}}</text>
					</sar-space>
				</template>
				<!-- 右侧按钮 -->
				<template #value>
					<sar-space>
						<sar-popover theme="dark">
						    <sar-popover-reference>
								<!-- 上传失败提示-->
								<sar-button type="text" v-if="item.status === 'failed'">
									<sar-icon name="InfoCircleOutlined" family="outlined" color="red"></sar-icon>
								</sar-button>
						    </sar-popover-reference>
								<template #content>
									<view class="failed-msg">
										{{item.message ? item.message : '上传失败'}}
									</view>
								</template>
						</sar-popover>
						<!-- 删除按钮 -->
						<sar-button type="text" :loading="item.status === 'uploading'" @click="handleDelete(index, item)" :disabled="props.disabled" v-if="props.removable" v-show="!readonly">
							<sar-icon name="DeleteOutlined" family="outlined" color="red" v-if="item.status !== 'uploading'"></sar-icon>
						</sar-button>
					</sar-space>
				</template>
			</sar-list-item>
		</sar-list>
	</sar-space>
</template>

<script setup lang="ts">
import type { UploadFileItem } from 'sard-uniapp'

// 参数
const props = defineProps<{
	// 上传的文件列表
	list: UploadFileItem[],
	// 上传的文件类型
	fileType: 'image' | 'video' | 'file',
	// 禁用
	disabled: boolean,
	// 只读
	readonly: boolean,
	// 可删除
	removable: boolean
}>()

// 抛出方法
const emits = defineEmits(['clickImage', 'clickVideo', 'clickFile', 'delete', 'clickFileName'])

// 点击图片
const handleClickImage = (index: number, file: UploadFileItem) => {
	emits('clickImage', index, file)
}

// 点击视频
const handleClickVideo = (index: number, file: UploadFileItem) => {
	emits('clickVideo', index, file)
}

// 点击文件
const handleClickFile = (index: number, file: UploadFileItem) => {
	emits('clickFile', index, file)
}

// 点击删除
const handleDelete = (index: number, file: UploadFileItem) => {
	emits('delete', index, file)
}

// 点击附件名称
const handleClickFileName = (index: number, file: UploadFileItem) => {
	emits('clickFileName', index, file)
}
</script>

<style scoped lang="scss">
.file-item {
	width: 20vw;
	height: 20vw;
	border-radius: 16rpx;
}
.file-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.failed-msg {
	max-width: 560rpx;
	padding: 16rpx;
	text-align: left;
}
</style>