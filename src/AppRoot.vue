<template>
	<view>
		<KuRootView />
		<!-- 通知代理组件 -->
		<sar-notify-agent />
		<!-- 模态框代理组件 -->
		<sar-dialog-agent />
		<!-- 裁剪组件代理 -->
		<sar-crop-image-agent />
		<!-- 轻量通知组件 -->
		<notice-lite v-model="noticeLiteVisible" :notice-id="noticeId"/>
	</view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useNoticeStore } from '@/stores/notice'
import { reapplyTabBarRedDot } from '@/helpers/tabbar-red-dot'
import NoticeLite from '@/components/notice-lite/index.vue'
const noticeStore = useNoticeStore()
/**
 * 根节点组件生命周期函数，在页面生命周期函数之前触发，避免处理复杂逻辑，详见：
 * https://uni-ku.js.org/projects/root/features#%E5%8A%9F%E8%83%BD%E4%B8%8E-uniapp-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%9B%86%E6%88%90
 */
onShow(() => {
	noticeStore.setTabbarRedDot()
	// 重放各红点源当前内存值（写点可能发生在非 tabbar 页，tabbar API 静默 fail，切回时重设；
	// 仅依赖通用红点 helper，勿在此引入具体业务域模块）
	reapplyTabBarRedDot()
})

onMounted(() => {
	initNoticeLite()
})

/**
 * 初始化轻量通知
 */
const initNoticeLite = () => {
	// 显隐抽屉
	const noticeLiteVisible = ref<boolean>(false)
	// 消息通知id
	const noticeId = ref<string>('')
	// 打开轻量通知详情
	const showNoticeLite = (id: string) => {
		noticeLiteVisible.value = false
		nextTick(() => {
			noticeId.value = id
			noticeLiteVisible.value = true
		})
	}
	
	return {
		noticeLiteVisible,
		noticeId,
		showNoticeLite
	}
}

const {noticeLiteVisible, noticeId, showNoticeLite} = initNoticeLite()

defineExpose({
	showNoticeLite
})
</script>
