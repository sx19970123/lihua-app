<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<!-- 预览头像 -->
			<user-avatar :size="750 - 32" shape="square" :type="avatarData.type" :customAvatar="avatarData"/>
			<!-- 操作菜单 -->
			<sar-list card>
				<sar-list-item title="选择照片" arrow hover @click="chooseImage"></sar-list-item>
				<sar-list-item title="选择图标" arrow hover @click="iconPopout = true"></sar-list-item>
				<sar-list-item title="编辑文本" arrow hover @click="handleTextAvatar"></sar-list-item>
			</sar-list>
		</sar-space>
		<!-- 文本抽屉 -->
		 <sar-popout v-model:visible="textPopout" :overlay-closable="!keyboardOpen" :show-close="false" @leave="handleCancel" :before-close="handleSave">
		    <view class="popout-content">
				<sar-space direction="vertical" size="large">
					<!-- 头像背景颜色 -->
					<color-select :dataSource="colorSource" v-model:color="avatarData.backgroundColor"></color-select>
					<!-- 头像文本 -->
					<sar-input :focus="autoFocus" root-class="rounded-input" placeholder="请输入文本" v-model="avatarData.value" @keyboardheightchange="handleKeyboardChange"></sar-input>
				</sar-space>
		    </view>
		</sar-popout>
		<!-- 图标抽屉 -->
		<sar-popout v-model:visible="iconPopout" :show-close="false" @leave="handleCancel" :before-close="handleSave">
		    <view class="popout-content">
				<!-- 头像背景颜色 -->
				<color-select :dataSource="colorSource" v-model:color="avatarData.backgroundColor"></color-select>
				<!-- 头像图标 -->
				<view>iconPopout</view>
				<view>iconPopout</view>
				<view>iconPopout</view>
		    </view>
		</sar-popout>
		<!-- 裁剪组件代理 -->
		<sar-crop-image-agent />
	</view>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { cropImage } from 'sard-uniapp'
import UserAvatar from '@/components/user-avatar/index.vue'
import ColorSelect from '@/components/color-select/index.vue'
import type { AvatarType } from '@/api/system/profile/type/AvatarType'
import { saveBasics } from '@/api/system/profile/Profile'
import { upload } from '@/api/system/attachment/AttachmentStorage'
import { useUserStore } from '@/stores/user'
import router from '@/router/Router'
import {toast} from '@/utils/Toast'
import {cloneDeep} from 'lodash-es'

const userStore = useUserStore()

// 头像背景颜色
const colorSource = [
  {
    name: '拂晓蓝',
    color: 'rgb(22, 119, 255)',
    key: '1'
  },
  {
    name: '薄暮',
    color: 'rgb(245, 34, 45)',
    key: '2'
  },
  {
    name: '火山',
    color: 'rgb(250, 84, 28)',
    key: '3'
  },
  {
    name: '日暮',
    color: 'rgb(250, 173, 20)',
    key: '4'
  },
  {
    name: '明青',
    color: 'rgb(19, 194, 194)',
    key: '5'
  },
  {
    name: '极光绿',
    color: 'rgb(82, 196, 26)',
    key: '6'
  },
  {
    name: '极客蓝',
    color: 'rgb(47, 84, 235)',
    key: '7'
  },
  {
    name: '酱紫',
    color: 'rgb(114, 46, 209)',
    key: '8'
  }
]

// 首个按钮背景颜色
const avatarBtnColor = 'rgba(var(--sar-secondary-rgb), 0.4)'
// 头像数据
const avatarData = ref<AvatarType>(cloneDeep(userStore.avatar))
// 取消修改
const handleCancel = () => {
	autoFocus.value = false
}
// 执行保存
const handleSave = async (type?: 'confirm' | 'cancel' | 'close') =>   {
	if (type === 'confirm') {
		try {
			// url 字段无需保存
			avatarData.value.url = undefined
			const resp = await saveBasics({avatar: JSON.stringify(avatarData.value)})
			if (resp.code === 200) {
				// 刷新store
				await userStore.initUserInfo()
				router.navigateBack({})
			} else {
				toast(resp.msg)
			}
		} catch(e) {
			console.error(e)
		}
	}
}
/**
 * 初始化图片头像
 */
const initImageAvatar = () => {
	// 头像地址
	const imageUrl = ref('')
	// 选择头像
	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				cropImage({
					src: res.tempFilePaths[0],
					success(filePath) {
						upload(filePath, "UserAvatar", "用户头像").then(resp => {
							avatarData.value.type = "image"
							avatarData.value.value = resp.data
							handleSave("confirm")
						}).catch(err => {
							console.log(err);
						})
					},
				})
			},
		})
	}
	
	return {
		imageUrl,
		chooseImage
	}
}

const {imageUrl, chooseImage} = initImageAvatar()

/**
 * 初始化图标头像
 */
const initIconAvatar = () => {
	// 图标抽屉开关
	const iconPopout = ref<boolean>(false)
	
	return {
		iconPopout
	}
}
const {iconPopout} = initIconAvatar()

/**
 * 初始化文本头像
 */
const initTextAvatar = () => {
	// 文本抽屉开关
	const textPopout = ref<boolean>(false)
	// 自动聚焦
	const autoFocus = ref<boolean>(false)
	// 键盘是否弹起
	const keyboardOpen = ref<boolean>(false)
	// 处理键盘事件
	const handleKeyboardChange = ({detail}:{detail: {height: number}}) => {
		if (detail.height === 0) {
			setTimeout(() => {
				keyboardOpen.value = false
			}, 200)
		} else {
			keyboardOpen.value = true
		}
	}
	// 处理文本头像
	const handleTextAvatar = () => {
		// 设置文本头像前头像不为文本则清除value值
		if (avatarData.value.type !== 'text') {
			avatarData.value.type = 'text'
			avatarData.value.value = ''
		}
		textPopout.value = true
		autoFocus.value = true
	}
	return {
		textPopout,
		autoFocus,
		keyboardOpen,
		handleTextAvatar,
		handleKeyboardChange
	}
}
const {textPopout, autoFocus, keyboardOpen, handleTextAvatar, handleKeyboardChange} = initTextAvatar()

</script>

<style scoped lang="scss">
	@import "@/static/style/input.scss";
	.avatar-title {
		font-size: var(--sar-text-lg);
		font-weight: var(--sar-font-bold);
	}
	.popout-content {
		padding-left: 32rpx; 
		padding-right: 32rpx
	}
	:deep(.sar-popout__header) {
		height: 32rpx !important;
	}
</style>
