// 遮罩平台适配器·app/Web：页面内层 setProperty 直驱；原生条带几何、侧滑返回锁与覆盖判定取宿主页。契约见 ../mask-platform.ts
import { computed } from 'vue'
import type { MaskHandles, MaskPlatform, MaskStrip } from '../mask-platform'

export const createPlatform = (h : MaskHandles) : MaskPlatform => {
	// 原生层挂着期间宿主页「禁用侧滑返回」的原值：null=未锁
	let swipeBackPrev : boolean | null = null
	// 悬浮 tabBar 占用的底部距离（页面底部避让减系统安全区）：0=没有悬浮 tabBar
	const floatingBarInset = () : number => {
		// #ifdef APP-IOS
		return (h.page?.safeAreaInsets.bottom ?? 0) - uni.getWindowInfo().safeAreaInsets.bottom
		// #endif
		// #ifndef APP-IOS
		return 0
		// #endif
	}
	return {
		// 写层：小程序走 :style 载体；App/Web 载体恒为空对象，运行期的值全部 setProperty 直驱
		carrierStyle : computed<any>(() => {
			return {}
		}),
		write : (p : number) => {
			h.rootEl.value?.style.setProperty('opacity', String(p))
		},
		// 悬浮 tabBar 盖在页面内容之上、压不到它下面的层：页面内层的底边抬到 tabBar 顶，该区域改由原生条带压暗
		syncBottom : () => {
			// #ifdef APP-IOS
			const bottom = floatingBarInset() > 0 ? (h.page?.safeAreaInsets.bottom ?? 0) : 0
			h.rootEl.value?.style.setProperty('bottom', `${bottom}px`)
			// #endif
		},
		// 原生条带范围=页面内容区之外的区域：上方（状态栏+导航栏）、下方（占位 tabBar 或悬浮 tabBar）
		buildStrips : () : MaskStrip[] => {
			const strips : MaskStrip[] = []
			// #ifdef APP
			const body = h.page?.pageBody
			if (body == null) {
				return strips
			}
			if (body.top > 0) {
				strips.push({ top: 0, bottom: body.top })
			}
			if (h.props.coverTabBar) {
				const screenBottom = uni.getWindowInfo().screenHeight
				// 悬浮 tabBar 不占页面高度：条带顶=屏底减页面底部避让距离；占位 tabBar：条带顶=内容区底边
				const barTop = floatingBarInset() > 0 ? screenBottom - (h.page?.safeAreaInsets.bottom ?? 0) : body.bottom
				if (barTop < screenBottom) {
					strips.push({ top: barTop, bottom: screenBottom })
				}
			}
			// #endif
			return strips
		},
		// iOS 侧滑返回不经过 onBackPress：原生层挂着期间禁掉宿主页的侧滑返回，摘掉时还原
		lockSwipeBack : () => {
			// #ifdef APP-IOS
			if (swipeBackPrev == null) {
				swipeBackPrev = h.page?.getPageStyle()?.getBoolean('disableSwipeBack') ?? false
			}
			h.page?.setPageStyle({ disableSwipeBack: true })
			// #endif
		},
		unlockSwipeBack : () => {
			// #ifdef APP-IOS
			if (swipeBackPrev != null) {
				h.page?.setPageStyle({ disableSwipeBack: swipeBackPrev })
				swipeBackPrev = null
			}
			// #endif
		},
		// 宿主页是否已被别的页面盖住：不再是页面栈顶，或其上开了弹窗页
		isCovered : () : boolean => {
			// #ifdef APP
			const pages = getCurrentPages()
			const dialogs = h.page?.getDialogPages()
			return pages[pages.length - 1] !== h.page || (dialogs != null && dialogs.length > 0)
			// #endif
			// #ifndef APP
			return false
			// #endif
		}
	}
}
