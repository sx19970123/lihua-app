/**
 * 请求的客户端类型
 */
export const getClientType = (): 'app' | 'wechat_mp' | 'app_h5' => {
	//#ifdef APP
		return 'app'
	//#endif

	//#ifdef MP-WEIXIN
		return 'wechat_mp'
	//#endif

	//#ifdef H5
		return 'app_h5'
	//#endif
}