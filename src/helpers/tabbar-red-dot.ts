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

const apply = () => {
	if (noticeSource || permissionSource) {
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
