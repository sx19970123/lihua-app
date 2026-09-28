<template>
	<view class="setup-step">
		<sar-icon class="setup-icon" family="icon" name="ApartmentOutlined" size="120rpx" color="var(--sar-primary)" />
		<text class="setup-title">默认部门</text>
		<text class="setup-desc">请设置您的默认部门</text>
		<view class="setup-form">
			<sar-card>
				<sar-input v-model="keyword" root-class="rounded-input keyword-input" placeholder="请输入部门名称" @input="handleSearch" />
				<sar-tree
					v-model:current="defaultDeptId"
					default-expand-all
					single-selectable
					ref="treeRef"
					:data="treeData"
					:node-keys="{ title: 'name', key: 'id' }"
					@select="handleSelectDept"
				/>
			</sar-card>
		</view>
		<view class="setup-btns">
			<sar-button round @click="handleNext">下一步</sar-button>
			<view class="setup-sub-btns">
				<sar-space align="center" size="0rpx">
					<sar-button type="pale-text" inline :root-style="{padding: '0'}" @click="emit('prev')">上一步</sar-button>
					<text v-if="!userStore.defaultDeptCode" class="sub-btn-divider">|</text>
					<sar-button v-if="!userStore.defaultDeptCode" type="pale-text" inline :root-style="{padding: '0'}" @click="skipDialogVisible = true">以后再说</sar-button>
				</sar-space>
			</view>
		</view>

		<!-- 跳过确认（APP 端 sard 弹窗不 teleport、内联渲染，排在页面尾部） -->
		<sar-dialog
			v-model:visible="skipDialogVisible"
			:headed="false"
			button-type="round"
			cancel-text="继续设置"
			confirm-text="以后再说"
			@confirm="emit('skip')">
			<view class="skip-dialog-content">可稍后在「个人中心 - 默认部门」中设置</view>
		</sar-dialog>
	</view>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {TreeExpose} from 'sard-uniapp'
import {useUserStore} from '@/stores/user'
import type {SysDept} from '@/api/system/dept/type/sys-dept'
import {traverse} from '@/utils/tree'
import {toast, toastRequestError} from '@/utils/toast'

const emit = defineEmits<{next: [], skip: [], prev: []}>()

const userStore = useUserStore()
const keyword = ref<string>('')
const treeRef = ref<TreeExpose>()
const skipDialogVisible = ref<boolean>(false)

// 默认部门id（进入向导前页面已完成 initUserInfo，deptTrees 就绪）
const defaultDeptId = ref<string | undefined>(userStore.defaultDept.id)

// 树形结构数据
const treeData = ref<SysDept[]>(userStore.deptTrees)

// 处理筛选
const handleSearch = () => {
	treeRef.value?.filter(keyword.value)
}

// 选中即设置默认部门（设置动作随选择即时提交，下一步仅校验结果）
const handleSelectDept = (key: string) => {
	traverse(treeData.value, (item: SysDept) => {
		if (item.id === key) {
			uni.showLoading({title: '加载中', mask: true})
			// 失败提示由 catch 统一兜底（401/451 请求层已 toast，跳过防双弹）
			userStore.updateDefaultDept(item).catch((err) => {
				console.error(err)
				toastRequestError(err)
			}).finally(() => {
				uni.hideLoading()
			})
			return true
		}
	})
}

// 下一步前校验已设置默认部门（与 web 端一致）
const handleNext = () => {
	if (userStore.defaultDeptCode) {
		emit('next')
	} else {
		toast("请选择默认部门")
	}
}
</script>

<style lang="scss">
@import "@/static/style/user-setup.scss";
@import "@/static/style/input.scss";

.keyword-input {
	margin-bottom: 16rpx;
}

.sub-btn-divider {
	margin: 0 24rpx;
	color: var(--sar-tertiary-color);
}

.skip-dialog-content {
	padding: 32rpx 0;
	text-align: center;
}
</style>
