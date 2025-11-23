<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<sar-list card title="基础设置">
				<sar-list-item title="头像" arrow hover>
					<template #value>
						<user-avatar class="avatar unobstructed"/>
					</template>
				</sar-list-item>
				<sar-list-item title="昵称" :value="userStore.userInfo.nickname" arrow hover></sar-list-item>
				<sar-list-item title="邮箱" :value="userStore.userInfo.email" arrow hover></sar-list-item>
				<sar-list-item title="性别" :value="userStore.userInfo.gender" arrow hover></sar-list-item>
				<sar-list-item title="手机号码" :value="userStore.userInfo.phoneNumber" arrow hover></sar-list-item>
				<sar-list-item title="数据更新" hover></sar-list-item>
			</sar-list>
			<sar-list card title="权限信息">
				<sar-list-item title="默认部门" :value="userStore.defaultDeptName" arrow hover></sar-list-item>
				<sar-list-item title="所属岗位" :value="userStore.defaultDeptPosts.map(post => post.name).join('、')" hover></sar-list-item>
				<sar-list-item title="我的角色" :value="userStore.roles.map(role => role.name).join('、')" hover></sar-list-item>
			</sar-list>
			<sar-list card title="安全设置">
				<sar-list-item title="修改密码" arrow hover></sar-list-item>
				<sar-list-item title="账号注销" arrow hover></sar-list-item>
			</sar-list>
			<view class="logout-btn">
				<sar-button type="pale" theme="danger" round @click="handleLogout">退出登录</sar-button>
			</view>
		</sar-space>
		<sar-dialog-agent />
	</view>
</template>

<script lang="ts" setup>
import { dialog } from 'sard-uniapp'
import { useUserStore } from '@/stores/user'
import UserAvatar from '@/components/user-avatar/index.vue'

const userStore = useUserStore()

/**
 * 处理退出登录
 */
const handleLogout = () => {
	dialog.confirm({
		message: "是否退出登录？",
		buttonType: 'round',
		onConfirm: () => {
			userStore.handleLogout()
		}
	})
}
</script>

<style scoped lang="scss">
.logout-btn {
	margin-top: 16rpx;
}
:deep(.sar-list__title) {
	margin-top: 16rpx
}
:deep(.sar-list-item__title) {
	min-width: 120rpx;
}
</style>