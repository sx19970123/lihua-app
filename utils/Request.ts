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
		const data = response.data as ResponseType<any>
		// 登录信息失效，调用store中的登录失效逻辑
		if (data.code === 401) {
			// todo 等待用户相关store开发完成
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