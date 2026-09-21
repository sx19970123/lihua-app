/**
 * 无需登录即可访问的路由列表
 */
const PUBLIC_ROUTES = [
	// 首屏页
	"/pages/splash/index",
	// 登录
	"/pages/login/Login",
	// 注册
	"/pages/login/Register",
	// 隐私政策
	"/subpackages/system/protocol/PrivacyPolicy",
	// 用户协议
	"/subpackages/system/protocol/UserAgreement",
	// 错误兜底页（403/404/451，未登录直达也要能展示）
	"/pages/error/Error"
]

/**
 * 判断是否公开路由（url 带 query 时按路径部分匹配）
 */
export const isPublicRoute = (url: string) => {
	return PUBLIC_ROUTES.includes(url.split("?")[0])
}
