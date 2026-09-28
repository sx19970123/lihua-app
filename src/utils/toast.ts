import type {ResponseErrorType} from '@/api/global/type'

/**
 * 显示轻提示
 */
export const toast = (msg: string, duration: number = 1500) => {
	uni.showToast({
		title: msg,
		duration: duration,
		icon: "none",
		position: "bottom"
	})
}

/**
 * 提示请求错误信息
 * 请求层仅 401/451 自动 toast（见 utils/request.ts 响应拦截器），其余失败路径静默抛错，
 * 调用方捕获后用此函数兜底提示；401/451 跳过避免双弹
 */
export const toastRequestError = (err: unknown) => {
	const errType = err as ResponseErrorType
	if (errType?.code !== 401 && errType?.code !== 451) {
		toast(errType?.msg ?? '请求失败')
	}
}