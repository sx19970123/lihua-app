<template>
	<view class="profile" :class="{ 'theme-dark': themeStore.isDark }">
		<!--头像-->
		<view class="title">
			<!-- 铃铛：hero 右上（top 与头像行状态栏让位同高） -->
			<view class="notice-btn" @click="toNotice">
				<sar-badge :value="noticeStore.unreadCount">
					<sar-icon name="BellOutlined" family="icon" size="42rpx" color="#fff"></sar-icon>
				</sar-badge>
			</view>
			<!-- 头像行：bottom 锚定 hero 底部 -->
			<view class="hero-row">
				<sar-space align="center" size="large">
					<!-- 头像 -->
					<view @click="toUserSetting()">
						<user-avatar/>
					</view>
					<sar-space direction="vertical" size="small">
						<!-- 昵称 -->
						<view class="nickname" @click="toUserSetting()">{{userStore.$state.nickname}}</view>
						<!-- 部门 -->
						<sar-space align="center" class="dept">
							<view @click="toChangeDept()">
								{{userStore.$state.defaultDeptName ? userStore.$state.defaultDeptName : '设置默认部门'}}
							</view>
							<sar-tag plain theme="primary" :root-style="{paddingTop: 0, paddingBottom: 0}" @click="toChangeDept()">
								<sar-icon family="icon" name="SwapOutlined"/>
							</sar-tag>
						</sar-space>
					</sar-space>
				</sar-space>
			</view>
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
/* 页头背景主题变量：亮色为默认值，暗色由根节点 theme-dark class 覆写（themeStore.isDark 驱动，App 内切换与系统跟随均即时生效）。
   色板与 lihua-web 登录页背景同源（亮取 noon、暗取 night 双套静态版，双端改色需同步）：
   上二天球下四海球四个柔边正圆径向光（px 半径保证任意屏宽下正圆，% 椭圆在矮宽 hero 会被横向拉长；radial-gradient 自带柔边免 blur 滤镜）+ 斜光带 + 基色线性渐变；
   基色渐变 0% 端锚定页面底色（亮 #f7f7f8/暗 #000000，与 --sar-body-bg 一致）保证下部融入内容区 */
.profile {
	--hero-bg:
		radial-gradient(circle 150px at 26% 2%, rgba(136, 180, 228, 0.42), transparent 70%),
		radial-gradient(circle 125px at 76% 0%, rgba(150, 200, 220, 0.36), transparent 68%),
		radial-gradient(circle 165px at 78% 102%, rgba(92, 172, 180, 0.38), transparent 70%),
		radial-gradient(circle 100px at 20% 104%, rgba(108, 130, 214, 0.34), transparent 68%),
		linear-gradient(100deg, rgba(250, 250, 250, 0) 32%, rgba(250, 250, 250, 0.08) 50%, rgba(250, 250, 250, 0) 68%),
		linear-gradient(to top, #f7f7f8 0%, #ebf1f4 55%, #f5fafb 100%);
	--hero-mask: linear-gradient(to top, #f7f7f8 0%, rgba(247,247,248,0) 100%);
}

/* 暗色与亮色同几何（半径/位置/止点逐球一致，调几何两套同步），仅换暗色板颜色；
   光球 alpha 为折减值：web 原值是 blur(90px) 前强度，压平版无 blur 需约减半才等效；
   渐变端点用同色零透明（transparent 在深底会经灰暗插值出脏边） */
.profile.theme-dark {
	--hero-bg:
		radial-gradient(circle 150px at 26% 2%, rgba(122, 158, 222, 0.16), rgba(122, 158, 222, 0) 70%),
		radial-gradient(circle 125px at 76% 0%, rgba(62, 88, 178, 0.2), rgba(62, 88, 178, 0) 68%),
		radial-gradient(circle 165px at 78% 102%, rgba(54, 80, 178, 0.2), rgba(54, 80, 178, 0) 70%),
		radial-gradient(circle 100px at 20% 104%, rgba(28, 96, 122, 0.18), rgba(28, 96, 122, 0) 68%),
		linear-gradient(100deg, rgba(138, 156, 190, 0) 32%, rgba(138, 156, 190, 0.05) 50%, rgba(138, 156, 190, 0) 68%),
		linear-gradient(to top, #000000 0%, #050a0e 55%, #070b12 100%);
	--hero-mask: linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
}

.title {
	position: relative;
	overflow: hidden;
	height: calc(10vh + 280rpx);
	background-image: var(--hero-bg);

	.nickname {
		font-weight: var(--sar-font-bold);
	}

	.dept {
		font-size: var(--sar-text-base);
		color:var(--sar-secondary-text);
	}

	/* 头像行：bottom 锚定（背景撑高后头像贴 hero 底部），压在 ::after 蒙层（z-index:1）之上 */
	.hero-row {
		position: absolute;
		left: 16px;
		right: 16px;
		bottom: 48rpx;
		z-index: 2;
	}

	/* 铃铛：hero 右上；半透明圆底在亮暗两套背景上均可读 */
	.notice-btn {
		position: absolute;
		top: 10vh;
		right: 16px;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		background: rgba(10, 12, 16, 0.24);
		border: 1rpx solid rgba(255, 255, 255, 0.18);
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
}

.setting-content {
	padding: 0 16rpx 16rpx 16rpx;
}
</style>
