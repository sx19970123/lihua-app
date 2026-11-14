// 请求头客户端类型（Client-Type 枚举值由后端约定）
export const getClientType = (): 'app' | 'wechat_mp' | 'app_h5' => {
	// #ifdef APP
	return 'app'
	// #endif
	// #ifdef MP-WEIXIN
	return 'wechat_mp'
	// #endif
	// #ifdef WEB
	return 'app_h5'
	// #endif
}
