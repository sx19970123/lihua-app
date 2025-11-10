import { Request, RequestConfig, Response} from '@/uni_modules/sard-uniapp'
import {type ResponseErrorType, ResponseError, type ResponseType} from "@/api/global/Type.ts"
import {getToken} from '@/utils/Token.ts'

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
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response: Response) => {
		
		return response
	},
	(error) => {
		return Promise.reject(error)
	}
)


// 数据返回统一封装样式
export default <T> (config: RequestConfig) => {
    return new Promise<ResponseType<T> & Blob>((resolve, reject) => {
        service
          .request<ResponseType<T> & Blob>(config)
          .then((response: Response<ResponseType<T> & Blob>) => {
              resolve(response.data)
          })
          .catch((err: ResponseErrorType) => {
              reject(err);
          });
    });
};