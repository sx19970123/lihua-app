import {defineStore} from "pinia";

/**
 * 主题store（x 端范围=亮暗感知起步；彩色主题受 hover-class 不能 var 等平台限制，挂 S1-06/S3-08）
 */
export const useThemeStore = defineStore('theme', {
    state: () => {
        /**
         * 当前是否深色模式
         */
        const isDark: boolean = false

        /**
         * 监听注册幂等标志（app 级注册不回收，组件消费前调 init 即可）
         */
        const inited: boolean = false

        return {isDark, inited}
    },
    actions: {
        /**
         * 读取当前亮暗（平台三分叉；App 端 appTheme 为 auto 时兜底系统 osTheme）
         */
        read() {
            // #ifdef APP
            const info = uni.getAppBaseInfo()
            let t = info.appTheme
            if (t === 'auto' || t == null) {
                t = uni.getSystemInfoSync().osTheme ?? 'light'
            }
            this.isDark = t === 'dark'
            // #endif
            // #ifdef WEB
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            // #endif
            // #ifdef MP-WEIXIN
            this.isDark = (uni.getAppBaseInfo() as any).hostTheme === 'dark'
            // #endif
        },
        /**
         * 初始化亮暗感知并注册变化监听（幂等；监听 app 级常驻不回收——
         * S2-02 App.uvue 组装时改由 onLaunch 显式调用，当前各消费方自行调用即可）
         */
        init() {
            if (this.inited) {
                return
            }
            this.inited = true
            this.read()
            // #ifdef APP
            uni.onAppThemeChange(() => this.read())
            uni.onOsThemeChange(() => this.read())
            // #endif
            // #ifdef WEB
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.read())
            // #endif
            // #ifdef MP-WEIXIN
            uni.onHostThemeChange(() => this.read())
            // #endif
        }
    }
})
