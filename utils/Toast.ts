/**
 * 显示轻提示
 */
export const toast = (msg: string) => {
	uni.showToast({
		title: msg,
		icon: "none",
		position: "bottom"
	})
}