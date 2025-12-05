import { Router } from 'sard-uniapp'
import { getToken } from '@/utils/Token'
import { useUserStore } from '@/stores/user'
import {connect, closeConnect} from '@/utils/WebSocket'
const router = new Router()

/**
 * 无需登录即可访问的路由列表
 */
const publicRoutesList = [
	// 首屏页
	"/pages/splash/index",
	// 登录
	"/pages/login/Login",
	// 注册
	"/pages/login/Register",
	// 隐私政策
	"/subpackages/system/protocol/PrivacyPolicy",
	// 用户协议
	"/subpackages/system/protocol/UserAgreement"
	]

/**
 * 路由守卫
 * 返回true或不返回数据正常跳转
 * 返回false阻止跳转
 * 返回Route跳转到指定页面
 */
router.beforeEach((to, from) => {
	const userStore = useUserStore()
	if (getToken()) {
		// 用户信息不存在，获取用户信息
		if (!userStore.userId) {
			userStore.initUserInfo()
			// 连接到websocket
			connect()
		} else {
			return true
		}
	} else {
		// 没有token断开websocket连接
		closeConnect()
		
		// 访问的页面是公开页面，可直接访问
		if (publicRoutesList.includes(to.url)) {
			return true
		}
		// 非公开页面跳转到登录页
		return '/pages/login/Login'
	}
})

export default router