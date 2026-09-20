import request from "@/utils/request";

/**
 * 检查手机号是否重复（true 表示未占用可用）
 */
export const checkPhoneNumber = (phoneNumber: string) => {
	return request<boolean>({
		url: 'app/system/user/checkPhoneNumber/' + phoneNumber,
		method: 'GET'
	})
}

/**
 * 检查邮箱是否重复（true 表示未占用可用）
 */
export const checkEmail = (email: string) => {
	return request<boolean>({
		url: 'app/system/user/checkEmail/' + email,
		method: 'GET'
	})
}
