import { defineStore } from "pinia";
/**
 * 系统主题store
 */
export const useThemeStore = defineStore('theme', {
	state: () => {
		// 当前模式
		const mode: 'auto' | 'dark' | 'light' = uni.getStorageSync("UIStyle") || 'auto'
		// 系统主题（auto 模式下的生效主题来源；未开启 darkmode 的平台无 theme 字段按亮色处理）
		const systemTheme: 'light' | 'dark' = uni.getSystemInfoSync().theme === 'dark' ? 'dark' : 'light'
		return {
			mode,
			systemTheme
		}
	},
	getters: {
		// 当前生效主题是否为暗色：强制模式以 mode 为准，auto 跟随系统主题
		isDark(): boolean {
			return this.mode === 'auto' ? this.systemTheme === 'dark' : this.mode === 'dark'
		}
	},
	actions: {
		// 更新系统主题（由 App 级 uni.onThemeChange 驱动）
		setSystemTheme(theme: 'light' | 'dark') {
			this.systemTheme = theme
		},
		// 设置主题模式（仅app支持）
		setMode(modeValue?: 'auto' | 'dark' | 'light') {
			// #ifdef APP
			// 没传入具体值使用mode默认值
			if (!modeValue) {
				plus.nativeUI.setUIStyle(this.mode)
				return
			}

			// 设置缓存并应用设置
			uni.setStorageSync("UIStyle", modeValue)
			plus.nativeUI.setUIStyle(modeValue)
			// #endif
		}
	}
})
