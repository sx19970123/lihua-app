import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'

/**
 * 登录/注册页键盘状态（需在页面 setup 中调用）
 *
 * openKeyboard：键盘弹起（高度 > 0）为 true。页面模板用它驱动
 * .auth-content 的 translateY(-30%) 上移与输入框 .show-caret 光标恢复，
 * 样式见 static/style/auth.scss
 */
export const useKeyboardStatus = () => {
	// 控制键盘弹起状态
	const openKeyboard = ref<boolean>(false)
	// 键盘高度变化监听
	const handleChangeKeyboardHeight = (data : UniNamespace.OnKeyboardHeightChangeResult) => {
		openKeyboard.value = data.height > 0
	}

	// uni 的键盘监听是全局的，页面隐藏时必须注销
	onShow(() => {
		uni.onKeyboardHeightChange(handleChangeKeyboardHeight)
	})

	onHide(() => {
		uni.offKeyboardHeightChange(handleChangeKeyboardHeight)
	})

	return {
		openKeyboard
	}
}
