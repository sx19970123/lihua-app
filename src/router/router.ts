import { Router } from 'sard-uniapp'
import { getToken } from '@/helpers/token'
import { useUserStore } from '@/stores/user'
import { useNoticeStore } from '@/stores/notice'
import { webSocket } from '@/utils/web-socket'
import { initDict } from '@/helpers/dict'
import { isPublicRoute } from '@/constants/public-routes'
import { getData, clearData } from '@/helpers/user-setup'
import pagesConfig from '@/pages.json'
const router = new Router()

// 登录后初始设置向导页路径
const USER_SETUP_URL = "/pages/user-setup/UserSetup"

// 全部注册页面路径（主包 pages + 分包 root/page；pages.json 为 uni 路由唯一事实源）
const REGISTERED_ROUTES = new Set<string>([
	...pagesConfig.pages.map(page => '/' + page.path),
	...(pagesConfig.subPackages ?? []).flatMap(sp => sp.pages.map(page => '/' + sp.root + '/' + page.path))
])

/**
 * 路由守卫判定（in-app 跳转守卫与 H5 地址栏补验共用同一份语义）
 * 返回 true 或不返回数据正常放行
 * 返回 false 阻止跳转（无 token 分支内部已 reLaunch 登录页完成纠偏）
 * 返回 {url} 跳转到指定页面（in-app 由 sard 拦截器消费；H5 补验侧需自行执行，见 runH5GuardCheck）
 */
const checkRouteGuard = (to: {url: string}): boolean | {url: string} | undefined => {
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
		}
		// 有 token 且用户信息就绪或已触发预热均放行
		return true
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
}

// #ifdef H5
/** 最近一次 in-app 导航（beforeEach 判定时）的目标路径（去 query）——hashchange 据此识别自己发起的变更，防止重复判定 */
let lastInstanceRoutePath = ""
// #endif

router.beforeEach((to) => {
	// #ifdef H5
	lastInstanceRoutePath = to.url.split("?")[0]
	// #endif
	return checkRouteGuard(to)
})

/** 归一为带前导斜杠的纯路径（去 query） */
const normalizeRoutePath = (path: string) => {
	const pure = path.split("?")[0]
	return pure.startsWith("/") ? pure : "/" + pure
}

/**
 * H5 地址栏补验执行（H-3）：地址栏输入/收藏分享直达/浏览器前进后退不经过 sard Router 的
 * 包装方法，beforeEach 不会执行——本函数以「冷启动首验 + hashchange 监听」复用同一份
 * 守卫判定纠偏。非 H5 平台调用为空操作（无地址栏，进入页面必经 router.*，守卫已全覆盖）。
 * hash 路由模式耦合 hashchange（manifest 未配置 h5 路由模式，uni 默认 hash；
 * 若未来切 history 模式须改监听 popstate）。
 */
export const setupH5Guard = () => {
	// #ifdef H5
	// 冷启动首验：直达带 hash 的初始加载不触发 hashchange 事件；启动路径取 getLaunchOptionsSync
	// （onLaunch 时页面栈尚未建立，不能取 getCurrentPages）；onLaunch 早于目标页 onLoad，纠偏闪烁最小
	const launchOptions = uni.getLaunchOptionsSync()
	runH5GuardCheck(normalizeRoutePath(launchOptions.path || ""))

	// 运行中地址栏变更：hashchange 触发时目标页已开始渲染，只能事后纠偏（浏览器无「拦截地址栏输入」钩子）；
	// sard 的 router.* 在 H5 底层同样改 hash 会触发本事件——比对 lastInstanceRoutePath 跳过自己发起的导航
	window.addEventListener("hashchange", () => {
		const path = normalizeRoutePath(location.hash.replace(/^#/, ""))
		if (path === lastInstanceRoutePath) {
			return
		}
		runH5GuardCheck(path)
	})
	// #endif
}

// #ifdef H5
/** H5 补验执行：非 in-app 进入没有 sard 拦截器消费守卫返回值，改道/纠偏需在此自行执行 */
const runH5GuardCheck = (url: string) => {
	// 未注册路径直接 404 兜底（uni-h5 对未知 hash 渲染空白页，无 catch-all 路由机制；
	// 与 lihua-web 端 /:pathMatch(.*)* 兜底同语义）；根路径（hash 为空）交由 uni-h5 自行重定向到首页
	if (url !== '/' && !REGISTERED_ROUTES.has(url)) {
		uni.reLaunch({url: '/pages/error/Error?type=404'})
		return
	}
	const result = checkRouteGuard({url: url})
	if (result && typeof result === "object") {
		// 判定要求改道（向导拉回）；false 分支（无 token）判定内部已 reLaunch 登录页，true 放行无动作
		uni.reLaunch({url: result.url})
	}
}
// #endif

export default router