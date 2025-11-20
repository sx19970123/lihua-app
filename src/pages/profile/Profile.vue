<template>
	<view>
		<!--头像-->
		<view class="title">
			<sar-space align="center" size="large">
				<!-- 头像 -->
				<user-avatar class="avatar unobstructed"/>
				<sar-space direction="vertical" size="small">
					<!-- 昵称 -->
					<view class="nickname unobstructed">{{userStore.$state.nickname}}</view>
					<!-- 部门 -->
					<sar-space align="center" class="dept unobstructed">
						{{userStore.$state.defaultDeptName ? userStore.$state.defaultDeptName : '设置默认部门'}}
						<sar-tag plain theme="primary" :root-style="{paddingTop: 0, paddingBottom: 0}">
							<sar-icon family="icon" name="swap"/>
						</sar-tag>
					</sar-space>
				</sar-space>
			</sar-space>
		</view>
		<!--操作列表-->
		<view class="setting-content">
			<sar-list card>
				<sar-list-item title="仓库" @click="toGitee" icon-family="icon" icon="gitee-grey-circle" hover arrow/>
				<sar-list-item title="关于" icon-family="icon" icon="info-circle" hover arrow/>
				<sar-list-item title="设置" icon-family="icon" icon="setting" hover arrow/>
			</sar-list>
		</view>
	</view>
</template>
<script setup lang="ts">
import {useUserStore} from '@/stores/user'
import router from '@/router/Router'
import UserAvatar from '@/components/user-avatar/index.vue'

const userStore = useUserStore()

const toGitee = () => {
	router.navigateTo({
		url: "/pages/webview/index?url=" + encodeURIComponent('https://gitee.com/yukino_git')
	})
}
	
</script>

<style>
page {
  position: fixed;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.title {
	position: relative;
	overflow: hidden;
	padding: 10vh 16px 16px 16px;
	/* 主背景渐变 + 线条纹理 */
	background-image:
		linear-gradient(to top, #f7f7f8 0%, #f0faff 5%, #99caf9 100%),
		repeating-linear-gradient(90deg, rgba(247,247,248,0.15) 0 20px, rgba(247,247,248,0) 20px 40px),
		repeating-linear-gradient(45deg, rgba(247,247,248,0.08) 0 10px, rgba(247,247,248,0) 10px 20px),
		repeating-linear-gradient(-45deg, rgba(247,247,248,0.08) 0 10px, rgba(247,247,248,0) 10px 20px);

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
		background: linear-gradient(to top, #f7f7f8 0%, rgba(247,247,248,0) 100%);
	}
	
	.unobstructed {
		position: relative;
		z-index: 2;
	}
}

.setting-content {
	padding: 0 16px 16px 16px;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
	.title {
		background-image:
			linear-gradient(to top, #000000 0%, #121529 5%, #3a557f 100%),
			repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 20px, rgba(0,0,0,0) 20px 40px),
			repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px),
			repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px);
    /* 深色模式底部遮罩 */
    &::after {
		background: linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
    }
  }
}
</style>
