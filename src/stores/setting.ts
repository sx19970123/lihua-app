import {defineStore} from "pinia";
import {enableCaptcha, enableSignUp} from "@/api/system/setting/setting";

/**
 * 系统设置store
 */
export const useSettingStore = defineStore('setting', {
    state: () => {
        /**
         * 是否启用验证码
         */
        const enableCaptcha: boolean = true

        /**
         * 是否启用自助注册
         */
        const enableSignUp: boolean = false

        return {
            enableCaptcha,
            enableSignUp
        }
    },
    actions: {
        /**
         * 初始化基础设置（登录/注册页进入时调用，重复调用为重新拉取）
         */
        async initBaseSetting() {
            await Promise.all([
                this.fetchEnableCaptcha(),
                this.fetchEnableSignUp()
            ])
        },
        /**
         * 获取是否开启验证码
         */
        async fetchEnableCaptcha() {
            const resp = await enableCaptcha()
            if (resp.code === 200) {
                this.$state.enableCaptcha = resp.data
            }
        },
        /**
         * 获取是否开启自助注册
         */
        async fetchEnableSignUp() {
            const resp = await enableSignUp()
            if (resp.code === 200) {
                this.$state.enableSignUp = resp.data
            }
        }
    }
})
