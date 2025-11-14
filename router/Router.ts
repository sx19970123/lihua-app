import { Router } from '@/uni_modules/sard-uniapp'
const router = new Router()

/**
 * 路由守卫
 * 返回true或不返回数据正常跳转
 * 返回false阻止跳转
 * 返回Route跳转到指定页面
 */
router.beforeEach((to, from) => {
	// todo 检查目标页面是否允许访问
	console.log("to",to)
	console.log("form",from)
})

export default router