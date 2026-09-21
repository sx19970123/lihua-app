<script setup lang="ts">
import {watch} from 'vue'
import {onLaunch} from "@dcloudio/uni-app"
import {useThemeStore} from "@/stores/theme"
import {useNoticeStore} from "@/stores/notice"
import {useRootRefStore} from "@/stores/root"
import {webSocket} from '@/utils/web-socket'
import type {NoticeMessage} from '@/api/system/notice/type/notice-message'
import router from "@/router/router"
import { setupH5Guard } from "@/router/router"
import { initDict, getDictLabel } from '@/helpers/dict'

// #ifdef APP-PLUS
// 仅app支持原生消息通知
import MessageNotify from '@/utils/message-notify'
// #endif

const themeStore = useThemeStore()
const noticeStore = useNoticeStore()
const rootRefStore = useRootRefStore()

onLaunch(() => {
	// 设置当前主题
	themeStore.setMode()
	// 跟随系统主题变化同步 systemTheme（isDark 的 auto 模式数据源）
	uni.onThemeChange((res) => themeStore.setSystemTheme(res.theme))
	// 处理通知初始化
	addNoticeEventListener()
	// H5 地址栏直达/前进后退补验（非 H5 平台为空操作）
	setupH5Guard()
})

// 处理websocket消息通知监听
const addNoticeEventListener = () => {
	// 订阅notice通知消息
	webSocket.addEventListener("WS_NOTICE", (data: NoticeMessage) => {
		// #ifdef APP-PLUS
		// 全局通知推送（仅原生app）
		showNotify(data)
		// #endif

		// 重新获取未读消息数量（unreadCount 变化经下方 watch 驱动红点更新）
		noticeStore.getUnreadCount()
	})
}

// 全局通知推送（仅原生app）
const showNotify = (data: NoticeMessage) => {
	// 消息/公告标识
	const pngName = data.type === '0' ? 'MessageOutlined.png' : 'NotificationOutlined.png'
	// 获取字典
	const {sys_notice_type} = initDict("sys_notice_type")
	// 全局消息提醒
	MessageNotify.show({title: '收到一条新' + getDictLabel(sys_notice_type.value, data.type), content: data.title, image: '_www/static/notice/' + pngName}, () => {
		// 跳转到详情页
		router.navigateTo({
			url: "/subpackages/system/notice/Detail",
			query: {
				id: data.id,
				title: data.title
			},
			success: () => noticeStore.markAsRead(data.id)
		})
	}, (direction) => {
		// 向下拖动打开抽屉预览，以根节点为媒介，拿到保存到rootStore中的根节点实例，调用通知方法
		if (direction === 'bottom') {
			const ref = rootRefStore.getRootRef()
			if (ref && ref.showNoticeLite) {
				ref.showNoticeLite(data.id)
			}
			// 向下拖动需要手动关闭通知
			MessageNotify.hide()
		}
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
/* 业务图标字体（iconfont 平台维护导出，新增图标整体替换 icon.css） */
@import '@/static/icons/icon.css';
@import '@/static/icons/custom.css';

page {
	background-color: var(--sar-body-bg);
	/* 全局基础文字色跟随主题（输入框值文字/依赖继承的文字与图标无组件级变量，
	   未设置时默认黑——暗色下全黑，见 sard body-color 体系） */
	color: var(--sar-body-color);
	/* H5 端 page（uni-page-body）高度随内容自适应，短内容页背景盖不满视口露出白底
	   （父级 uni-page-wrapper 为定高 flex 子项，100% 可解析）；APP/小程序 page 原生全屏，此声明无害 */
	min-height: 100%;
}
text {
	color: var(--sar-secondary-color);
}

.content {
	padding: 16rpx;
}

/* #ifdef H5 */
/* 页面下层画布（html/body，overscroll 回弹区与页面渲染前白屏期可见）跟随主题：
   sard 的主题变量作用域在 page 上、html/body 取不到，按 theme.json 的
   bgColorTop/Bottom 基线色双值写死（改 theme.json 基线色须同步此处） */
html,
body {
	background-color: #f7f7f8;
}
@media (prefers-color-scheme: dark) {
	html,
	body {
		background-color: #000000;
	}
}
/* #endif */
</style>
