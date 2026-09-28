<template>
	<!-- #ifdef APP -->
	<sar-popup
		v-model:visible="innerVisible"
		effect="zoom"
		:overlay-closable="false"
		back-press="close"
		root-style="width: var(--sar-dialog-width); max-width: var(--sar-dialog-max-width);">
			<view class="update-dialog">
				<view class="update-dialog__title">发现新版本 v{{ info?.versionName }}</view>
				<scroll-view scroll-y class="update-dialog__message-wrap">
					<view class="update-dialog__message">{{ info?.updateContent || '优化体验，修复已知问题' }}</view>
				</scroll-view>

			<!-- 下载进度（仅实际下载时显示，检查已下载阶段不显示） -->
			<view v-if="downloading" class="update-dialog__progress">
				<sar-progress-bar :percent="percent" :show-text="false" root-style="width: 100%" />
				<text class="update-dialog__progress-text">{{ percent }}%</text>
			</view>

			<view class="update-dialog__footer">
				<sar-button
					type="pale"
					theme="primary"
					round
					block
					:disabled="processing"
					@click="handleLater">以后再说</sar-button>
				<sar-button
					theme="primary"
					round
					block
					:loading="processing"
					:disabled="processing"
					@click="handleUpdate">立即更新</sar-button>
			</view>
		</view>
	</sar-popup>
	<!-- #endif -->
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { toast } from '@/utils/toast'
import { checkPackageExists, installPackage, downloadPackage, openLinkUpdate } from '@/helpers/app-update'
import type { AppUpdateInfo } from '@/helpers/app-update'

const props = defineProps<{
	/** 是否显示 */
	visible: boolean
	/** 更新信息（downloadType/downloadUrl 已由检查层按热更优先解析并补全地址） */
	info: AppUpdateInfo | null
}>()

const emit = defineEmits<{
	/** 更新 visible */
	(e: 'update:visible', value: boolean): void
}>()

// 内部 visible（用于 v-model:visible 代理）
const innerVisible = computed({
	get: () => props.visible,
	set: (val) => emit('update:visible', val)
})

// 是否处理中（检查已下载 / 下载中）
const processing = ref(false)
// 是否下载中（控制进度条显示）
const downloading = ref(false)
// 下载进度
const percent = ref(0)

// 关闭弹窗时重置状态
watch(() => props.visible, (val) => {
	if (!val) {
		processing.value = false
		downloading.value = false
		percent.value = 0
	}
})

// 立即更新
const handleUpdate = async () => {
	const info = props.info
	if (!info?.downloadUrl) {
		toast('更新地址异常')
		return
	}

	// iOS/鸿蒙 link 类型：跳应用市场或分发页（鸿蒙经 openLinkUpdate 轻提示引导），关闭弹窗
	if (info.downloadType === 'link') {
		openLinkUpdate(info.downloadUrl)
		innerVisible.value = false
		return
	}

	processing.value = true

	try {
		// 阶段一：检查是否已下载过该版本包（按钮 loading，不显示进度条）
		const existingFile = await checkPackageExists(info.versionCode, info.downloadType)
		if (existingFile) {
			// 已下载过：直接安装（秒装）
			await installPackage(existingFile, info.downloadType)
			innerVisible.value = false
			return
		}

		// 阶段二：未下载过，显示进度条开始下载
		downloading.value = true
		percent.value = 0
		const filePath = await downloadPackage(
			info.versionCode,
			info.downloadUrl,
			info.downloadType,
			(p: number) => {
				percent.value = p
			}
		)
		downloading.value = false

		// 阶段三：下载完成，安装
		await installPackage(filePath, info.downloadType)
		innerVisible.value = false
	} catch (e) {
		console.error('[AppUpdate] 更新执行失败', info.downloadType, e)
		toast((e as Error)?.message || '更新失败，请稍后重试')
	} finally {
		processing.value = false
		downloading.value = false
	}
}

// 以后再说（关闭弹窗，红点保持，直到用户真的更新了 App）
const handleLater = () => {
	innerVisible.value = false
}
</script>

<style scoped lang="scss">
.update-dialog {
	box-sizing: border-box;
	width: 100%;
	background: var(--sar-dialog-bg);
	border-radius: var(--sar-dialog-border-radius);
}

.update-dialog__title {
	padding: var(--sar-dialog-body-padding-y) var(--sar-dialog-body-padding-x) 0;
	font-size: var(--sar-dialog-title-font-size);
	font-weight: var(--sar-font-bold);
	text-align: center;
	color: var(--sar-emphasis-color);
}

.update-dialog__message-wrap {
	max-height: 400rpx;
	margin: var(--sar-dialog-body-gap) 0;
}

.update-dialog__message {
	padding: 0 var(--sar-dialog-body-padding-x);
	font-size: var(--sar-dialog-message-font-size);
	line-height: 44rpx;
	color: var(--sar-dialog-message-color);
	white-space: pre-wrap;
}

.update-dialog__progress {
	padding: 0 var(--sar-dialog-body-padding-x) var(--sar-dialog-body-padding-y);
}

.update-dialog__progress-text {
	display: block;
	margin-top: 12rpx;
	font-size: 24rpx;
	color: var(--sar-secondary-color);
	text-align: center;
}

.update-dialog__footer {
	display: flex;
	flex-direction: row;
	gap: var(--sar-dialog-footer-round-gap);
	padding: 0 var(--sar-dialog-footer-round-padding-x) var(--sar-dialog-footer-round-padding-y);
}
</style>
