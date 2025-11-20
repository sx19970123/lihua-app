import { Request} from 'sard-uniapp'
import type {RequestConfig, Response} from 'sard-uniapp'
import {type ResponseErrorType, ResponseError, type ResponseType} from "@/api/global/Type"
import {getToken} from '@/utils/Token'
import {useUserStore} from '@/stores/user'

const service = new Request({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 50000
})

// 请求拦截器
service.interceptors.request.use(
	(config: RequestConfig) => {
		// 默认请求头
		config.header['Content-Type'] = "application/json;charset=utf-8"
		// 验证token
		const token = getToken()
		if (token) {
			config.header['Authorization'] = "Bearer " + token
		}
		console.info("发送请求===>", config.url);
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
		// 登录信息失效，调用store中的登录失效逻辑
		if (data.code === 401) {
			const userStore = useUserStore()
			userStore.authenticationFailure()
		}
		// 非法ip访问
		if (data.code === 407) {
			// todo 等待系统开发完善
		}
		// 服务器处理文件异常，提示异常信息
		if (data.code === 501) {
			new ResponseError(data.code, data.msg)
		}
		
		return response
	},
	(error) => {
		// 请求出现异常
		return Promise.reject(new ResponseError(500, error.errMsg));
	}
)


// 数据返回统一封装样式
export default <T> (config: RequestConfig) => {
    return new Promise<ResponseType<T> & ArrayBuffer>((resolve, reject) => {
        service
          .request<ResponseType<T> & ArrayBuffer>(config)
          .then((response: Response<ResponseType<T> & ArrayBuffer>) => {
              resolve(response.data)
          })
          .catch((err: ResponseErrorType) => {
              reject(err);
          });
    });
};