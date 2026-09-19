import { Router } from 'sard-uniapp'
import { getToken } from '@/helpers/token'
import { useUserStore } from '@/stores/user'
import { useNoticeStore } from '@/stores/notice'
import { webSocket } from '@/utils/web-socket'
import { initDict } from '@/helpers/dict'
import { isPublicRoute } from '@/constants/public-routes'
const router = new Router()

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