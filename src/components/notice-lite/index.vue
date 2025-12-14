<template>
	<sar-popout :title="noticeData.title" v-model:visible="visible" @update:visible="handleUpdate" :show-confirm="false">
	    <scroll-view scroll-y style="max-height: 60vh;">
			<view class="content">
				<view class="notice-meta">
					<text>
						{{noticeData.releaseUser}} {{noticeData.releaseTime}}
					</text>
				</view>
				<!-- 富文本解析组件 -->
				<mp-html :content="noticeData.content" :tag-style="tagStyle"/>
			</view>
		</scroll-view>
	</sar-popout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MpHtml from "@/components/mp-html/mp-html.vue"
import {useNoticeStore} from "@/stores/notice"
import type {PreviewNotice} from '@/api/system/notice/type/PreviewNotice';

const noticeStore = useNoticeStore()
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

// 通知公告数据
const noticeData = ref<PreviewNotice>({})

// 预览通知公告
const handlePreview = async () => {
	noticeStore.previewNotice(props.noticeId).then((resp) => {
		noticeData.value = resp
		noticeStore.markAsRead(props.noticeId)
	})
}

// 双向绑定
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
@import "@/static/style/notice-detail.scss";
</style>