<script setup lang="ts">
import {onLaunch, onShow, onHide, onReady} from "@dcloudio/uni-app"
import {useThemeStore} from "@/stores/theme"
import {websocket} from '@/utils/WebSocket'
const themeStore = useThemeStore()

onLaunch(() => {
	// 设置当前主题
	themeStore.setMode()
	// 处理通知红点
	handleNoticeListener()
})
onShow(() => {
	console.log("app show");
})
onHide(() => {
	console.log("app hide");
})


// 处理websocket消息通知监听
const handleNoticeListener = () => {
	// 订阅notice通知消息，收到消息后显示底部红点
	websocket.addEventListener("WS_NOTICE", () => {
		uni.showTabBarRedDot({
			index: 1
		})
	})
}
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
