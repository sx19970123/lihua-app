<script setup lang="ts">
import {watch} from 'vue'
import {onLaunch} from "@dcloudio/uni-app"
import {useThemeStore} from "@/stores/theme"
import {useNoticeStore} from "@/stores/notice"
import {websocket} from '@/utils/WebSocket'
const themeStore = useThemeStore()
const noticeStore = useNoticeStore()

onLaunch(() => {
	// 设置当前主题
	themeStore.setMode()
	// 处理通知初始化
	addNoticeEventListener()
})


// 处理websocket消息通知监听
const addNoticeEventListener = () => {
	// 订阅notice通知消息
	websocket.addEventListener("WS_NOTICE", () => {
		// 重新获取未读消息数量，尝试更新红点
		noticeStore.getUnreadCount().finally(() => noticeStore.setTabbarRedDot())
	})
}
// 监听未读消息变化
watch(() => noticeStore.unreadCount, () => noticeStore.setTabbarRedDot())
</script>

<style lang="scss">
/* 全局样式 */
@import "@/uni.scss";
/* sard-uniapp组件库样式 */
@import 'sard-uniapp/index.scss';
/* sard-uniapp组件库暗色模式 */
@import 'sard-uniapp/dark.scss';
/* 自定义图标 */
@import '@/static/icons/filled.css';
@import '@/static/icons/custom.css';
@import '@/static/icons/outlined.css';

page {
	background-color: var(--sar-body-bg);
}
text {
	color: var(--sar-secondary-color);
}

.content {
	padding: 16rpx;
}
</style>
