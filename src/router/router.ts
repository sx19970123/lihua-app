import { Router } from 'sard-uniapp'
import { getToken } from '@/helpers/token'
import { useUserStore } from '@/stores/user'
import { useNoticeStore } from '@/stores/notice'
import { webSocket } from '@/utils/web-socket'
import { initDict } from '@/helpers/dict'
import { isPublicRoute } from '@/constants/public-routes'
import { getData, clearData } from '@/helpers/user-setup'
const router = new Router()

// 登录后初始设置向导页路径
const USER_SETUP_URL = "/pages/user-setup/UserSetup"

/**
 * 路由守卫
 * 返回true或不返回数据正常跳转
 * 返回false阻止跳转
 * 返回Route跳转到指定页面
 */
router.beforeEach((to, from) => {
	const userStore = useUserStore()
	const noticeStore = useNoticeStore()

	if (getToken()) {
		// 登录后补全未完成：拉回向导页（覆盖杀 App 重启/直接打开任意页的绕过路径）；
		// 目标本就是向导页时直接放行——向导页自行 await initUserInfo，
		// 跳过下方懒加载初始化（向导期间不连 WS/拉红点，完成时由向导页补齐）
		if (getData().length > 0) {
			if (to.url.split("?")[0] !== USER_SETUP_URL) {
				return { url: USER_SETUP_URL }
			}
			return true
		}

		// 用户信息不存在，获取用户信息
		if (!userStore.userId) {
			// 预热用户信息：失败不阻断导航（乐观放行，登录态异常由 401 拦截器兜底登出）
			userStore.initUserInfo().catch(err => console.error("用户信息预热失败", err))
			// 连接到websocket
			webSocket.connect()
			// 获取最新的未读消息（内部已容错，失败不抛错）
			noticeStore.getUnreadCount()
			// 缓存通知类型字典
			initDict("sys_notice_type")
		} else {
			return true
		}
	} else {
		// 没有token断开websocket连接
		webSocket.closeConnect()
		// 清理未完成的登录后补全暂存（退出登录/登录失效兜底，防脏数据残留）
		clearData()
		// 访问的页面是公开页面，可直接访问
		if (isPublicRoute(to.url)) {
			return true
		}

		// 退回登录页
		uni.reLaunch({
			url: "/pages/login/Login"
		})
		return false
	}
})

export default router