/**
 * 触觉反馈工具
 */

/**
 * 轻触感反馈：在需要触觉确认的时刻同步调用（如下拉越阈值、拖拽吸附到位），无参数无返回值。
 * 平台行为：iOS 走 UIImpactFeedbackGenerator（light 档）；Android 走原生 performHapticFeedback，
 * 按 CONTEXT_CLICK → VIRTUAL_KEY → 6 → 1 优先级逐个尝试；均不可用时兜底 uni.vibrateShort，
 * 再失败退 plus.device.vibrate(10ms)。任何一步失败均静默、不抛错；
 * H5 / 小程序端整体为 no-op（函数体被 #ifdef APP-PLUS 条件编译包裹），调用方无需做平台判断。
 */
export function triggerLightHaptic() {
	// #ifdef APP-PLUS
	const plusApi = (globalThis as any).plus
	const isIos = String(plusApi?.os?.name || '').toLowerCase() === 'ios'
	const isAndroid = String(plusApi?.os?.name || '').toLowerCase() === 'android'
	if (isIos && plusApi?.ios) {
		try {
			plusApi.ios.importClass('UIImpactFeedbackGenerator')
			const generator = plusApi.ios.newObject('UIImpactFeedbackGenerator', 'initWithImpactStyle:', 1)
			generator.prepare()
			generator.impactOccurred()
			plusApi.ios.deleteObject(generator)
			return
		} catch (error) {
			// iOS 触感反馈不可用时静默失败。
		}
	}
	if (isAndroid && triggerAndroidHaptic(plusApi)) {
		return
	}

	uni.vibrateShort({
		fail: () => {
			plusApi?.device?.vibrate?.(10)
		},
	})
	return
	// #endif
}

/**
 * Android 原生触感（私有）：对当前 decorView 按反馈类型优先级依次 performHapticFeedback，
 * 任一成功即返回 true；Android API 不可用 / 全部失败返回 false，交由上层兜底链。
 */
function triggerAndroidHaptic(plusApi: any) {
	const androidApi = plusApi?.android
	if (!androidApi) {
		return false
	}
	try {
		const activity = androidApi.runtimeMainActivity()
		const decorView = activity?.getWindow?.()?.getDecorView?.()
		if (!decorView) {
			return false
		}
		const hapticConstants = androidApi.importClass('android.view.HapticFeedbackConstants')
		const feedbackTypes = [
			hapticConstants?.CONTEXT_CLICK,
			hapticConstants?.VIRTUAL_KEY,
			6,
			1,
		].filter((type) => typeof type === 'number')
		for (const feedbackType of feedbackTypes) {
			if (androidApi.invoke(decorView, 'performHapticFeedback', feedbackType)) {
				return true
			}
		}
	} catch (error) {
		return false
	}
	return false
}
