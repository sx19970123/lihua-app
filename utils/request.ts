import {ResponseError, type ResponseType} from "@/api/global/type"
import {getToken} from '@/helpers/token'
import {getClientType} from '@/utils/client'
import {toast} from '@/utils/toast'
import {BASE_API} from '@/utils/env'
import {useUserStore} from '@/stores/user'

// 请求配置（api 层调用形态与旧 sard Request 一致，api 文件零改动直迁）
export interface RequestConfig {
	url: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	data?: any
	timeout?: number
	header?: Record<string, any>
}

const TIMEOUT = 5000

/**
 * 前置：组装通用请求头（对应 web/uniapp 请求拦截器）
 */
const before = (config: RequestConfig): Record<string, any> => {
	const header: Record<string, any> = {...config.header}
	header['Client-Type'] = getClientType()
	const token = getToken()
	if (token) {
		header['Authorization'] = "Bearer " + token
	}
	return header
}

/**
 * 后置：业务码分流（对应 web/uniapp 响应拦截器）：
 * 401=登录信息失效｜账号密码错误：非登录页调 store 登录失效（清态+重登跳转）；登录页上的 401 是凭据错误，仅提示
 * 403=权限不足跳错误页（后端为 HTTP 200 + 业务码 403，statusCode 判断为网关直返防御）
 * 451=非法 IP 跳错误页；505=服务器处理文件异常仅提示
 */
const after = <T>(statusCode: number, data: any, resolve: (v: ResponseType<T>) => void, reject: (e: ResponseError) => void) => {
	const resp = data as ResponseType<T>
	if (resp?.code === 401) {
		// 登录页豁免：重登跳转会重建登录页、记住账号回填冲掉用户已输入的账号密码
		const currentRoute = getCurrentPages().pop()?.route
		if (currentRoute !== "pages/login/Login") {
			useUserStore().authenticationFailure()
		}
		toast(resp.msg)
		reject(new ResponseError(resp.code, resp.msg))
		return
	}
	if (resp?.code === 403 || statusCode === 403) {
		toErrorPage("403")
		reject(new ResponseError(403, resp?.msg))
		return
	}
	if (resp?.code === 451) {
		toErrorPage("451")
		reject(new ResponseError(resp.code, resp.msg))
		return
	}
	if (resp?.code === 505) {
		reject(new ResponseError(resp.code, resp.msg))
		return
	}
	if (statusCode !== 200) {
		reject(new ResponseError(500, statusCode + '异常'))
		return
	}
	resolve(resp)
}

/**
 * 跳错误兜底页（403 无权限 / 451 IP 限制）。已在错误页则跳过防重复 reLaunch
 */
const toErrorPage = (type: '403' | '404' | '451') => {
	const currentRoute = getCurrentPages().pop()?.route
	if (currentRoute === "pages/error/Error") {
		return
	}
	uni.reLaunch({
		url: `/pages/error/Error?type=${type}`,
		fail: (err) => console.error("错误页跳转失败", err)
	})
}

/**
 * 请求封装：resolve 整个 ResponseType（调用方自行判断 code === 200）；url 约定不带前导斜杠
 */
const request = <T>(config: RequestConfig): Promise<ResponseType<T>> => {
	return new Promise((resolve, reject) => {
		const header = before(config)
		header['Content-Type'] = "application/json;charset=utf-8"
		console.info("发送请求===>", BASE_API, config.url);
		uni.request({
			url: BASE_API + '/' + config.url,
			method: config.method ?? 'GET',
			data: config.data,
			timeout: config.timeout ?? TIMEOUT,
			header,
			success: (res) => {
				console.info("接收响应===>", res.data);
				after<T>(res.statusCode, res.data, resolve, reject)
			},
			fail: (err) => {
				reject(new ResponseError(500, err.errMsg))
			}
		})
	})
}

export default request

// 上传大文件耗时远超普通请求，独立超时对齐 uni.uploadFile 平台默认 60s
const UPLOAD_TIMEOUT = 60 * 1000

/**
 * 附件上传（uni.uploadFile 版）；formData 值必须为字符串
 */
export const attachmentUpload = <T>(config: {url: string, filePath: string, name?: string, header?: Record<string, any>, formData?: Record<string, any>, timeout?: number}): Promise<ResponseType<T>> => {
	return new Promise((resolve, reject) => {
		const header = before(config as RequestConfig)
		// multipart 头跟传输形态走（与 request 自加 JSON 头对称）：App/小程序手动声明、原生补 boundary；
		// WEB 端不设（浏览器自动生成含 boundary 的头，手动指定必坏）
		// #ifdef APP || MP-WEIXIN
		header['Content-Type'] = 'multipart/form-data'
		// #endif
		uni.uploadFile({
			url: BASE_API + '/' + config.url,
			filePath: config.filePath,
			name: config.name ?? 'file',
			header,
			formData: config.formData,
			timeout: config.timeout ?? UPLOAD_TIMEOUT,
			success: (res) => {
				try {
					const data = JSON.parse(res.data) as ResponseType<T>
					after<T>(res.statusCode, data, resolve, reject)
				} catch (err) {
					reject(new ResponseError(500, '响应解析失败'))
				}
			},
			fail: (err) => {
				reject(new ResponseError(500, err.errMsg))
			}
		})
	})
}
