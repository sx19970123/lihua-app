<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<sar-list card>
				<sar-list-item title="用户设置" icon-family="icon" icon="UserOutlined" arrow hover @click="toSettingPage('user/index')"></sar-list-item>		
			</sar-list>
			<!-- #ifdef APP -->
			<!-- 仅app支持手动切换主题 -->
			<sar-list card>
				<sar-list-item title="系统主题" icon-family="icon" icon="BgColorsOutlined" arrow hover @click="toSettingPage('theme/index')"></sar-list-item>
			</sar-list>
			<!-- App 检查更新：右侧展示当前版本号，启动静默检查有新版本时红点提醒 -->
			<sar-list card>
				<sar-list-item title="检查更新" icon-family="icon" icon="SyncOutlined" arrow hover @click="handleCheckUpdate">
					<template #value>
						<view class="update-value">
							<sar-badge :dot="hasUpdateFlag"/>
							<text>v{{ currentVersion }}</text>
						</view>
					</template>
				</sar-list-item>
			</sar-list>
			<!-- #endif -->
			<sar-list card>
				<sar-list-item title="用户协议" icon-family="icon" icon="ExceptionOutlined" arrow hover @click="goProtocol('UserAgreement')"></sar-list-item>
				<sar-list-item title="隐私政策" icon-family="icon" icon="FileProtectOutlined" arrow hover @click="goProtocol('PrivacyPolicy')"></sar-list-item>
			</sar-list>
		</sar-space>
		<!-- #ifdef APP -->
		<app-update-dialog v-model:visible="updateDialogVisible" :info="updateInfo"/>
		<!-- #endif -->
		<view class="logout-btn">
			<sar-button type="pale" theme="danger" round @click="handleLogout">退出登录</sar-button>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import router from '@/router/router'
import { dialog } from 'sard-uniapp'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'
import { checkAppUpdate, clearAppUpdateRemind, getCurrentVersionName, getHasUpdateFlag } from '@/helpers/app-update'
import type { AppUpdateInfo } from '@/helpers/app-update'
// #ifdef APP
import AppUpdateDialog from '@/subpackages/system/setting/components/AppUpdateDialog.vue'
// #endif
const userStore = useUserStore()

// 跳转到不同的配置页面
const toSettingPage = (pageName: string) => {
	const baseURL = "/subpackages/system/setting/"
	router.navigateTo({
		url: baseURL + pageName
	})
}

// 前往隐私政策
const goProtocol = (pageName: string) => {
	router.navigateTo({
		url: "/subpackages/system/protocol/" + pageName,
	})
}

// App 检查更新：当前版本号展示 + 手动检查（红点由启动静默检查点亮）
const currentVersion = getCurrentVersionName()

const initAppUpdate = () => {
	// 设置页红点标志（启动静默检查点亮，无更新/安装成功熄灭）
	const hasUpdateFlag = ref(getHasUpdateFlag())
	// 更新弹窗开关与检查到的更新信息
	const updateDialogVisible = ref(false)
	const updateInfo = ref<AppUpdateInfo | null>(null)

	// 手动检查更新：点击即熄导航提醒（tabbar/设置入口），有更新弹窗，无更新轻提示，异常提示失败
	//（静默检查的异常由 App.vue 吞掉）；「检查更新」条目红点保留至更新安装完成
	const handleCheckUpdate = async () => {
		clearAppUpdateRemind()
		try {
			const info = await checkAppUpdate()
			if (info) {
				updateInfo.value = info
				hasUpdateFlag.value = getHasUpdateFlag()
				updateDialogVisible.value = true
			} else {
				hasUpdateFlag.value = false
				toast('已是最新版本')
			}
		} catch {
			toast('检查更新失败，请稍后重试')
		}
	}

	return {
		hasUpdateFlag,
		updateDialogVisible,
		updateInfo,
		handleCheckUpdate
	}
}
const { hasUpdateFlag, updateDialogVisible, updateInfo, handleCheckUpdate } = initAppUpdate()

// 从更新弹窗/安装器返回本页时同步红点状态
onShow(() => {
	hasUpdateFlag.value = getHasUpdateFlag()
})

// 处理退出登录
const handleLogout = () => {
	dialog.confirm({
		message: "是否退出登录？",
		buttonType: 'round',
		onConfirm: () => {
			// 退出请求失败时本地登出仍由 store finally 兜底，此处仅消 unhandled rejection
			userStore.handleLogout().catch(() => undefined)
		}
	})
}
</script>
<style scoped lang="scss">
.logout-btn {
	position: absolute;
	left: 16rpx;
	right: 16rpx;
	bottom: 48rpx;
}

.update-value {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8rpx;
}
</style>