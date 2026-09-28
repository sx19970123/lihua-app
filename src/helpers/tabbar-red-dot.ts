/**
 * tabBar「我的」红点统一维护（槽位共享收敛）
 *
 * uni.showTabBarRedDot 是单槽布尔，消息未读与权限待更新两个来源共用同一槽位，
 * 亮/灭必须收敛到一处判定（任一来源为真即亮），分散调用会互相覆盖熄灭。
 * 该 API 仅在 tabBar 页面生效（其余页面进 fail 回调静默失败），
 * 与既有约定一致：切回 tabBar 页时由调用方重设。
 */

// 「我的」页在 tabBar 中的下标（与 notice store 的 NOTICE_TAB_INDEX 同槽位）
const PROFILE_TAB_INDEX = 1

// 消息未读来源
let noticeSource = false
// 权限待更新来源
let permissionSource = false
// App 更新提醒来源（新版本导航提醒，持久化状态经 app-update 域同步）
let appUpdateSource = false

const apply = () => {
	if (noticeSource || permissionSource || appUpdateSource) {
		uni.showTabBarRedDot({ index: PROFILE_TAB_INDEX })
	} else {
		uni.hideTabBarRedDot({ index: PROFILE_TAB_INDEX })
	}
}

/** 消息未读红点来源置位（notice store 消费） */
export const setNoticeRedDotSource = (on: boolean) => {
	noticeSource = on
	apply()
}

/** 权限待更新红点来源置位（permissionUpdate 状态消费） */
export const setPermissionRedDotSource = (on: boolean) => {
	permissionSource = on
	apply()
}

/** App 更新提醒红点来源置位（app-update 域的持久化提醒状态消费） */
export const setAppUpdateRedDotSource = (on: boolean) => {
	appUpdateSource = on
	apply()
}

/**
 * 按各源当前内存值重放红点（AppRoot onShow 切回 tabbar 页时调用）：
 * 写点可能发生在非 tabbar 页（uni API 静默 fail），切回时重放内存值即可，调用方无需感知各源细节
 */
export const reapplyTabBarRedDot = () => {
	apply()
}
