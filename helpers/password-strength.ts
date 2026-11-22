// 密码强度等级（注册页强度条数据源）
// 阈值与 web/master 同源（弱=6 位 / 中=8 位字母+数字 / 强=10 位字母+数字+符号）
// 注：Android 运行时正则引擎不支持 \p{L} 等 Unicode 属性转义，改用 ASCII 字母类
const weakRegex = /^.{6,}$/
const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
const strongRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{10,}$/

/**
 * 计算密码强度等级
 * @returns 0 未达弱 / 1 弱 / 2 中 / 3 强（空值 0，调用方以值非空控制条显隐）
 */
export const getPasswordStrength = (password: string): number => {
	if (!password) {
		return 0
	}
	if (strongRegex.test(password)) {
		return 3
	}
	if (mediumRegex.test(password)) {
		return 2
	}
	if (weakRegex.test(password)) {
		return 1
	}
	return 0
}
