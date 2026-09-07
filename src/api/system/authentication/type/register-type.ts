export interface RegisterType {
	/**
	 * 用户名
	 */
	username: string
	/**
	 * 密码
	 */
	password: string
	/**
	 * 确认密码
	 */
	confirmPassword: string
	/**
	 * 验证码信息
	 */
	captchaVerification?: string
}