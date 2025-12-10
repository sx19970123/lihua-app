<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<!-- app 开启动态导航栏，需要占位元素 -->
		<sar-tabbar-pit />
		<!-- #endif -->
		
		<view class="notice-title">
			{{title}}
		</view>
		<view class="notice-meta">
			<text>
				{{releaseUser}} {{releaseTime}}
			</text>
		</view>
		<!-- 富文本解析组件 -->
		<mp-html :content="content" :tag-style="tagStyle"/>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { preview } from '@/api/system/notice/Notice'
import dayjs from "dayjs"
import { toast } from '@/utils/Toast';
import { ResponseError } from '@/api/global/Type'
import MpHtml from "@/components/mp-html/mp-html.vue"

const title = ref<string>()
const releaseUser = ref<string>()
const releaseTime = ref<string>()
const content = ref<string>()

const initPreview = async (id?: string) => {
	if (!id) {
		toast("通知公告id不存在")
		return
	}
	try {
		const resp = await preview(id)
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


onLoad((option) => {
	// 设置标题
	uni.setNavigationBarTitle({
		title: decodeURIComponent(option?.title)
	})
	// 初始化预览
	initPreview(option?.id)
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