<template>
	<!-- 无导航栏：各步自带大标题；顶部留状态栏高度（custom 导航页面内容延伸至状态栏下） -->
	<view class="setup-page" :style="{paddingTop: statusBarHeight + 'px'}">
		<!-- 步骤轮播：按钮驱动（disable-touch 禁手势滑动，前进只能经各步提交按钮）；
		     initUserInfo 完成后才挂载步骤（守卫恢复进入时默认部门步依赖的 deptTrees 尚未就绪） -->
		<swiper v-if="initialized" class="setup-swiper" :current="current" :disable-touch="true" @change="handleSwiperChange">
			<swiper-item v-for="step in steps" :key="step">
				<scroll-view class="setup-scroll" scroll-y>
					<UserSetupStart v-if="step === 'start'" @next="handleNext(step)" @go-login="handleGoLogin" />
					<UserSetupResetPassword v-else-if="step === 'UserSetupResetPassword'" @next="handleNext(step)" @prev="handlePrev" />
					<UserSetupUserBasics v-else-if="step === 'UserSetupUserBasics'" @next="handleNext(step)" @prev="handlePrev" />
					<UserSetupDefaultDept v-else-if="step === 'UserSetupDefaultDept'" @next="handleNext(step)" @skip="handleNext(step)" @prev="handlePrev" />
					<UserSetupComplete v-else-if="step === 'complete'" @complete="handleFinish" />
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {onLoad, onBackPress} from '@dcloudio/uni-app'
import router from '@/router/router'
import {useUserStore} from '@/stores/user'
import {useNoticeStore} from '@/stores/notice'
import {webSocket} from '@/utils/web-socket'
import {initDict} from '@/helpers/dict'
import {toastRequestError} from '@/utils/toast'
import {getData, removeDataItem, clearData} from '@/helpers/user-setup'
import type {UserSetupItem} from '@/helpers/user-setup'
import UserSetupStart from '@/components/user-setup/UserSetupStart.vue'
import UserSetupResetPassword from '@/components/user-setup/UserSetupResetPassword.vue'
import UserSetupUserBasics from '@/components/user-setup/UserSetupUserBasics.vue'
import UserSetupDefaultDept from '@/components/user-setup/UserSetupDefaultDept.vue'
import UserSetupComplete from '@/components/user-setup/UserSetupComplete.vue'

const userStore = useUserStore()
const noticeStore = useNoticeStore()

// 已知待补全项（后端值域；未知值剔除，防后端新增类型时旧版卡在无渲染步骤）
const KNOWN_ITEMS: UserSetupItem[] = ['UserSetupResetPassword', 'UserSetupUserBasics', 'UserSetupDefaultDept']

// 步骤序列：固定首尾 + 暂存中的待补全项（登录成功时写入，杀 App 重启后恢复剩余步骤）
const steps = ['start', ...getData().filter(item => KNOWN_ITEMS.includes(item as UserSetupItem)), 'complete']

// 当前步骤下标（swiper 受控，按钮是唯一驱动方式）
const current = ref<number>(0)

// 步骤挂载门闩：initUserInfo 完成后再渲染步骤
const initialized = ref<boolean>(false)

// 状态栏高度（自绘导航栏让位）
const statusBarHeight = uni.getWindowInfo().statusBarHeight || 0

onLoad(async () => {
	try {
		await userStore.initUserInfo()
	} catch (err) {
		// 失败不阻断：空部门树仍可走其余步骤，返回登录可离场；登录态异常由 401 拦截兜底
		console.error("向导页用户信息初始化失败", err)
		toastRequestError(err)
	}
	initialized.value = true
})

// 拦截物理返回/侧滑，流程只能前进或经「退出登录」离场
onBackPress(() => true)

// swiper 受控同步（页码被外部改变时回写 current）
const handleSwiperChange = (event: {detail: {current: number}}) => {
	current.value = event.detail.current
}

// 前进（skip 复用）：内容步先从暂存剔除，杀 App 重启后不重复已完成步骤
const handleNext = (step: string) => {
	if (KNOWN_ITEMS.includes(step as UserSetupItem)) {
		removeDataItem(step)
	}
	current.value += 1
}

// 后退（swiper 常驻挂载，已填内容保留）
const handlePrev = () => {
	current.value = Math.max(0, current.value - 1)
}

// 完成进入系统：清暂存 + 补齐守卫懒加载漏掉的初始化
// （向导流程已 initUserInfo，进首页时守卫走「userId 已存在」分支，不再连 WS/拉红点/缓存字典）
const handleFinish = () => {
	clearData()
	webSocket.connect()
	noticeStore.getUnreadCount()
	initDict("sys_notice_type")
	router.reLaunch({url: "/pages/index/index"})
}

// 退出登录离场：清暂存防残留（token 清理与回登录页由 store 完成）
const handleGoLogin = async () => {
	clearData()
	await userStore.handleLogout()
}
</script>

<style lang="scss">
/* input.scss 页面级引入：rounded-input 规则需随页面样式下发，才能穿进 password-input
   等孙组件内部的 sar-input（组件级引入受小程序样式隔离限制穿透不进去，与设置页同级引入一致） */
@import "@/static/style/input.scss";
</style>

<style scoped lang="scss">
.setup-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	/* paddingTop（状态栏让位）内衬进 100vh，保证 swiper 撑满剩余高度 */
	box-sizing: border-box;
	background-color: var(--sar-body-bg);
}

.setup-swiper {
	flex: 1;
	width: 100%;
}

.setup-scroll {
	height: 100%;
}
</style>
