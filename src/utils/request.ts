import { Request} from 'sard-uniapp'
import type {RequestConfig, Response} from 'sard-uniapp'
import {type ResponseErrorType, ResponseError, type ResponseType} from "@/api/global/type"
import {getToken} from '@/helpers/token'
import {useUserStore} from '@/stores/user'
import {getClientType} from '@/utils/client'
 import {toast} from '@/utils/toast'

const service = new Request({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
	(config: RequestConfig) => {
		// 默认请求头（上传请求除外：multipart 的 Content-Type 须由原生实现/浏览器自动组装，手动指定会丢 boundary）
		if (config.method !== 'UPLOAD') {
			config.header['Content-Type'] = "application/json;charset=utf-8"
		}
		config.header['Client-Type'] = getClientType()
		// 验证token
		const token = getToken()
		if (token) {
			config.header['Authorization'] = "Bearer " + token
		}
		console.info("发送请求===>", config.baseURL, config.url);
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response: Response) => {
		const data = response.data as ResponseType<any>
		console.info("接收响应===>", data);
		// 登录信息失效｜账号密码错误，非登录页调用 store 中的登录失效逻辑（重登跳转）；
		// 登录页上的 401 是凭据错误：重登跳转会重建登录页、记住账号回填冲掉用户已输入的账号密码，仅提示即可
		if (data.code === 401 || response.statusCode === 403) {
			const currentRoute = getCurrentPages().pop()?.route
			if (currentRoute !== "pages/login/Login") {
				const userStore = useUserStore()
				userStore.authenticationFailure()
			}
			toast(data.msg)
			throw new ResponseError(data.code, data.msg)
		}
		
		// 非法ip访问：App 端无专用错误页，直接透出后端提示
		if (data.code === 451) {
			toast(data.msg)
			throw new ResponseError(data.code, data.msg)
		}
		
		// 服务器处理文件异常，提示异常信息
		if (data.code === 505) {
			throw new ResponseError(data.code, data.msg)
		}
		
		// statusCode 不为200、403 直接提示异常码
		if (response.statusCode !== 200) {
			throw new ResponseError(500, response.statusCode + '异常')
		}
		
		return response
	},
	(error) => {
		// 请求出现异常
		throw new ResponseError(500, error.errMsg);
	}
)


// 数据返回统一封装样式
export default <T> (config: RequestConfig) => {
    return new Promise<ResponseType<T>>((resolve, reject) => {
        service
          .request<ResponseType<T>>(config)
          .then((response: Response<ResponseType<T>>) => {
              resolve(response.data)
          })
          .catch((err: ResponseErrorType) => {
              reject(err);
          });
    });
};

// 上传大文件耗时远超普通请求，独立超时对齐 uni.uploadFile 平台默认 60s
const UPLOAD_TIMEOUT = 60 * 1000

export const attachmentUpload = <T> (config: RequestConfig) => {
	return new Promise<ResponseType<T>>((resolve, reject) => {
		if (!config.url) {
			reject()
			return
		}
		service
			.upload<ResponseType<T>>(config.url, {...config, timeout: config.timeout ?? UPLOAD_TIMEOUT})
			.then((response: Response<ResponseType<T>>) => {
			    resolve(response.data)
			})
			.catch((err: ResponseErrorType) => {
				reject(err);
			});
	})
}