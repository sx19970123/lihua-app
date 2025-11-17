import { Router } from '@/uni_modules/sard-uniapp'
import { getToken } from '@/utils/Token'
import { useUserStore } from '@/stores/user'

const router = new Router()

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
		} else {
			return true
		}
	} else {
		// token 不存在跳转到登录页
		return '/pages/login/Login'
	}
})

export default router