/**
 * 触觉反馈工具
 */
// 预热标志：原生桥/class 通道只需初始化一次，后续触发真机震动时复用，避免首次进阈值卡顿。
let hapticWarmedUp = false

/**
 * 预热触觉反馈：提前做一次轻量原生调用，初始化 JS↔原生桥与底层 class 通道。
 * 应在用户交互早期调用（如页面 onMounted），把首次原生开销提前到用户无感知的时机；
 * 可选调用——不预热时 triggerLightHaptic 仍可用，仅首次触发可能轻微卡顿。
 * 重复调用幂等（模块级标志去重）；H5 / 小程序端为 no-op。
 */
export function warmupHaptic() {
	if (hapticWarmedUp) {
		return
	}
	hapticWarmedUp = true
	// #ifdef APP-PLUS
	const plusApi = (globalThis as any).plus
	const osName = String(plusApi?.os?.name || '').toLowerCase()
	// 安卓：预先 importClass 并触发一次最低强度震动，初始化桥通道。
	if (osName === 'android') {
		triggerAndroidHaptic(plusApi)
	}
	// iOS：首次 importClass + prepare 生成器，开销极低，不实际触发 impact。
	if (osName === 'ios' && plusApi?.ios) {
		try {
			plusApi.ios.importClass('UIImpactFeedbackGenerator')
		} catch {
			// 预热失败不影响后续触发逻辑。
		}
	}
	// #endif
}

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
