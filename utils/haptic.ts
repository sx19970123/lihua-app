// 触感震动：type=light/medium/heavy；onText 收一行结果文案（自检用，可省略）。调用失败不抛出。
// 系统关了触感时不震（iOS 静音模式、低电量、未开系统触感）；运行时过旧没有此 API；Web 不支持
export const haptic = (type : 'light' | 'medium' | 'heavy', onText ?: (text : string) => void) : void => {
	// #ifdef WEB
	onText?.('Web 端不支持震动')
	// #endif
	// #ifndef WEB
	try {
		uni.vibrateShort({
			type,
			success : () => { onText?.(`${type}：成功`) },
			fail : (err) => { onText?.(`${type}：失败 ${err.errCode} ${err.errMsg}`) }
		})
	} catch (e) {
		onText?.(`${type}：调用异常 ${e}`)
	}
	// #endif
}
