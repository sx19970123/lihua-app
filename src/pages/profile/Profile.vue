<template>
	<view class="profile" :class="{ 'theme-dark': themeStore.isDark }">
		<!--头像-->
		<view class="title">
			<sar-space justify="between" align="center">
				<sar-space align="center" size="large">
					<!-- 头像 -->
					<view class="unobstructed" @click="toUserSetting()">
						<user-avatar/>
					</view>
					<sar-space direction="vertical" size="small">
						<!-- 昵称 -->
						<view class="nickname unobstructed" @click="toUserSetting()">{{userStore.$state.nickname}}</view>
						<!-- 部门 -->
						<sar-space align="center" class="dept unobstructed">
							<view @click="toChangeDept()">
								{{userStore.$state.defaultDeptName ? userStore.$state.defaultDeptName : '设置默认部门'}}
							</view>
							<sar-tag plain theme="primary" :root-style="{paddingTop: 0, paddingBottom: 0}" @click="toChangeDept()">
								<sar-icon family="icon" name="SwapOutlined"/>
							</sar-tag>
						</sar-space>
					</sar-space>
				</sar-space>
				<!-- 通知 -->
				<view style="margin-right: 16rpx;" @click="toNotice">
					<sar-badge :value="noticeStore.unreadCount">
						<sar-icon name="BellOutlined" family="icon" size="42rpx"></sar-icon>
					</sar-badge>
				</view>
			</sar-space>
		</view>
		<!--操作列表-->
		<view class="setting-content">
			<sar-list card>
				<sar-list-item title="设置" @click="toSetting" icon-family="icon" icon="SettingOutlined" hover arrow/>
				<sar-list-item title="组件" @click="toComponentList" icon-family="icon" icon="SkinOutlined" hover arrow/>
				<sar-list-item title="仓库" @click="toGitee" icon-family="custom" icon="GiteeCustom" hover arrow/>
			</sar-list>
		</view>
	</view>
</template>
<script setup lang="ts">
import {useUserStore} from '@/stores/user'
import {useNoticeStore} from "@/stores/notice"
import {useThemeStore} from "@/stores/theme"
import router from '@/router/router'
import UserAvatar from '@/components/user-avatar/index.vue'
import { GITEE_REPO_URL } from '@/constants/repo'

const userStore = useUserStore()
const noticeStore = useNoticeStore()
const themeStore = useThemeStore()

// 前往gitee
const toGitee = () => {
	router.navigateTo({
		url: "/pages/webview/index?url=" + encodeURIComponent(GITEE_REPO_URL)
	})
}

// 前往设置
const toSetting = () => {
	router.navigateTo({
		url: "/subpackages/system/setting/index"
	})
}

// 前往组件列表
const toComponentList = () => {
	router.navigateTo({
		url: '/subpackages/system/components/index'
	})
}

// 前往修改部门
const toChangeDept = () => {
	router.navigateTo({
		url: "/subpackages/system/setting/user/SaveDefaultDept"
	})
}

// 前往用户设置
const toUserSetting = () => {
	router.navigateTo({
		url: "/subpackages/system/setting/user/index"
	})
}

// 前往消息通知
const toNotice = () => {
	router.navigateTo({
		url: "/subpackages/system/notice/index"
	})
}
</script>

<style scoped lang="scss">
/* 页头渐变主题变量：亮色为默认值，暗色由根节点 theme-dark class 覆写（themeStore.isDark 驱动，App 内切换与系统跟随均即时生效） */
.profile {
	--hero-bg:
		linear-gradient(to top, #f7f7f8 0%, #f0faff 5%, #99caf9 100%),
		repeating-linear-gradient(90deg, rgba(247,247,248,0.15) 0 20px, rgba(247,247,248,0) 20px 40px),
		repeating-linear-gradient(45deg, rgba(247,247,248,0.08) 0 10px, rgba(247,247,248,0) 10px 20px),
		repeating-linear-gradient(-45deg, rgba(247,247,248,0.08) 0 10px, rgba(247,247,248,0) 10px 20px);
	--hero-mask: linear-gradient(to top, #f7f7f8 0%, rgba(247,247,248,0) 100%);
}

.profile.theme-dark {
	--hero-bg:
		linear-gradient(to top, #000000 0%, #121529 5%, #3a557f 100%),
		repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 20px, rgba(0,0,0,0) 20px 40px),
		repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px),
		repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px);
	--hero-mask: linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
}

.title {
	position: relative;
	overflow: hidden;
	padding: 10vh 16px 16px 16px;
	/* 主背景渐变 + 线条纹理 */
	background-image: var(--hero-bg);

	background-blend-mode: overlay;

	.nickname {
		font-weight: var(--sar-font-bold);
	}

	.dept {
		font-size: var(--sar-text-base);
		color:var(--sar-secondary-text);
	}

	/* 底部遮罩 */
	&::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 80rpx;
		pointer-events: none;
		z-index: 1;
		background: var(--hero-mask);
	}

	.unobstructed {
		position: relative;
		z-index: 2;
	}
}

.setting-content {
	padding: 0 16rpx 16rpx 16rpx;
}
</style>
