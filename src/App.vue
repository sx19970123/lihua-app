<script setup lang="ts">
import {watch} from 'vue'
import {onLaunch} from "@dcloudio/uni-app"
import {useThemeStore} from "@/stores/theme"
import {useNoticeStore} from "@/stores/notice"
import {useUserStore} from "@/stores/user"
import {webSocket} from '@/utils/web-socket'
import { setPermissionRedDotSource } from '@/helpers/tabbar-red-dot'
import { showNoticePush } from '@/helpers/notice-notify'
import type {NoticeMessage} from '@/api/system/notice/type/notice-message'
import { setupH5Guard } from "@/router/router"
// #ifdef APP-PLUS
import { checkAppUpdate, getAppUpdateRemind } from '@/helpers/app-update'
import { setAppUpdateRedDotSource } from '@/helpers/tabbar-red-dot'
// #endif

const themeStore = useThemeStore()
const noticeStore = useNoticeStore()

onLaunch(() => {
	// 设置当前主题
	themeStore.setMode()
	// 跟随系统主题变化同步 systemTheme（isDark 的 auto 模式数据源）
	uni.onThemeChange((res) => themeStore.setSystemTheme(res.theme))
	// 处理通知初始化
	addNoticeEventListener()
	// H5 地址栏直达/前进后退补验（非 H5 平台为空操作）
	setupH5Guard()
	// #ifdef APP-PLUS
	// 恢复 App 更新提醒红点（持久化状态，静默检查的点亮/熄灭在 app-update 域内同步）
	setAppUpdateRedDotSource(getAppUpdateRemind())
	// App 启动静默检查更新：有新版本仅点亮红点不打扰用户，失败静默（结果处理在 utils 内部收口）
	checkAppUpdate().catch(() => undefined)
	// #endif
})

// 处理websocket消息通知监听
const addNoticeEventListener = () => {
	// 订阅notice通知消息
	webSocket.addEventListener("WS_NOTICE", (data: NoticeMessage) => {
		// 原生通知横幅（平台分叉在 helper 内部，非 APP 平台为空实现）
		showNoticePush(data)

		// 重新获取未读消息数量（unreadCount 变化经下方 watch 驱动红点更新）
		noticeStore.getUnreadCount()
	})

	// 权限数据更新提示：角色/菜单变更后服务端定向推送——置红点（tabBar + 个人中心头像），点击头像静默刷新生效
	webSocket.addEventListener("WS_REFRESH_PERMISSION", () => {
		useUserStore().$state.permissionUpdate = true
	})
}

// 监听未读消息变化
watch(() => noticeStore.unreadCount, () => noticeStore.setTabbarRedDot())

// 监听权限待更新标志：驱动 tabBar 红点（与未读消息共享槽位，经 tabbar-red-dot 收敛判定）
watch(() => useUserStore().permissionUpdate, (on) => setPermissionRedDotSource(on), { immediate: true })
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
