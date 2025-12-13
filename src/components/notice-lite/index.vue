<template>
	<sar-popout :title="title" v-model:visible="visible" @update:visible="handleUpdate" :show-confirm="false">
	    <scroll-view scroll-y style="max-height: 60vh;">
			<view class="content">
				<view class="notice-meta">
					<text>
						{{releaseUser}} {{releaseTime}}
					</text>
				</view>
				<!-- 富文本解析组件 -->
				<mp-html :content="content" :tag-style="tagStyle"/>
			</view>
		</scroll-view>
	</sar-popout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MpHtml from "@/components/mp-html/mp-html.vue"
import { preview } from '@/api/system/notice/Notice'
import dayjs from "dayjs"
import { toast } from '@/utils/Toast';

// 显隐抽屉&通知id
const props = defineProps<{
	modelValue: boolean
	noticeId: string
}>()
// 双向绑定
const emits = defineEmits(["update:modelValue"])
// 显隐抽屉
const visible = ref<boolean>(props.modelValue)
// 双向绑定更新
const handleUpdate = (val: boolean) => {
	visible.value = val
	emits("update:modelValue", val)
}

const title = ref<string>()
const releaseUser = ref<string>()
const releaseTime = ref<string>()
const content = ref<string>()

// 预览通知公告
const handlePreview = async () => {
	try {
		const resp = await preview(props.noticeId)

		if (resp.code === 200) {
			const data = resp.data
			title.value = data.title
			content.value = data.content
			releaseUser.value = data.releaseUser
			releaseTime.value = dayjs(data.releaseTime).format('YYYY-MM-DD HH:mm')
		} else {
			toast(resp.msg)
		}
	} catch(err) {
		if (err instanceof ResponseError) {
			toast((err as unknown as ResponseError).msg)
		} else {
			console.error(err)
		}
	}
}

// 双向绑定回显
watch(() => props.modelValue, (newValue) => {
	visible.value = newValue
	if (newValue && props.noticeId) {
		handlePreview()
	}
})

const tagStyle = {
  "*": "max-width:100%;box-sizing:border-box;",
  "img": "max-width:100%;height:auto;display:block;",
  "table": "width:100%;display:block;overflow-x:auto;"
}
</script>


<style lang="scss">
/* 通知公告标题 */
.notice-title {
	text-align: center;
	font-size: var(--sar-text-xl);
	font-weight: var(--sar-font-bold);
}
/* 通知公告标题 */
.notice-meta {
	text-align: center;
	font-size: var(--sar-text-sm);
	color: var(--sar-secondary);
	margin: 16rpx 0 32rpx 0;
}
</style>