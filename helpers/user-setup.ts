// 登录后待补全项类型（与后端 postLoginCheck 返回值一一对应，顺序由后端策略 @Order 决定）
export type UserSetupItem = "UserSetupResetPassword" | "UserSetupUserBasics" | "UserSetupDefaultDept"

const POST_LOGIN_CHECK_KEY: string = "lihua_post_login_check_data"

/**
 * 设置待补全项
 */
export const setData = (items: string[]) => {
	uni.setStorageSync(POST_LOGIN_CHECK_KEY, items.join(","))
}

/**
 * 获取待补全项（无数据返回空数组）
 */
export const getData = (): string[] => {
	const value = uni.getStorageSync(POST_LOGIN_CHECK_KEY)
	return value ? String(value).split(",") : []
}

/**
 * 清除待补全项
 */
export const clearData = () => {
	uni.removeStorageSync(POST_LOGIN_CHECK_KEY)
}

/**
 * 完成单项后从待补全项中剔除（全部完成时整体清除）
 */
export const removeDataItem = (item: string) => {
	const filter = getData().filter(checkDataItem => checkDataItem !== item)
	if (filter.length > 0) {
		setData(filter)
	} else {
		clearData()
	}
}
