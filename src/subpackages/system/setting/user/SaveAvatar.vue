<template>
	<view class="content avatar-content">
		<sar-space direction="vertical" size="large">
			<!-- 预览头像 -->
			<user-avatar :size="750 - 32" shape="square" :type="avatarData.type" :customAvatar="avatarData" />
			<!-- 操作菜单 -->
			<sar-list card>
				<sar-list-item title="选择照片" arrow hover @click="chooseImage"></sar-list-item>
				<sar-list-item title="编辑文本" arrow hover @click="handleTextAvatar"></sar-list-item>
			</sar-list>
		</sar-space>
		<!-- 文本抽屉 -->
		<sar-popout v-model:visible="textPopout" :overlay-closable="!keyboardOpen" :show-close="false"
			@leave="autoFocus = false" :before-close="handleSave">
			<view class="popout-content">
				<sar-space direction="vertical" size="large">
					<!-- 头像背景颜色 -->
					<color-select :dataSource="AVATAR_COLOR_SOURCE" v-model:color="avatarData.backgroundColor"></color-select>
					<!-- 头像文本 -->
					<sar-input :focus="autoFocus" :adjust-position="false" root-class="rounded-input"
						placeholder="请输入文本" v-model="avatarData.value"
						@keyboardheightchange="handleKeyboardChange"></sar-input>
				</sar-space>
			</view>
		</sar-popout>
	</view>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { cropImage } from 'sard-uniapp'
import UserAvatar from '@/components/user-avatar/index.vue'
import ColorSelect from '@/components/color-select/index.vue'
import type { AvatarType } from '@/api/system/profile/type/avatar-type'
import { saveBasics } from '@/api/system/profile/profile'
import { upload } from '@/api/system/attachment/attachment-storage'
import { useUserStore } from '@/stores/user'
import router from '@/router/router'
import { toast, toastRequestError } from '@/utils/toast'
import { cloneDeep } from 'lodash-es'
import {getFileInfo} from '@/utils/attachment/attachment-utils'
import { AVATAR_COLOR_SOURCE } from '@/constants/avatar-colors'

const userStore = useUserStore()
type EditableAvatarType = AvatarType & { value: string }

// 头像数据
const avatarData = ref<EditableAvatarType>({
	...cloneDeep(userStore.avatar),
	value: userStore.avatar.value || ''
})

// 执行保存（作为 popout 的 before-close：promise 在途时确认按钮自动 loading，reject 阻止抽屉关闭）
const handleSave = async (type ?: 'confirm' | 'cancel' | 'close') => {
	if (type === 'confirm') {
		// url 字段无需保存；用局部 payload 不清响应式源——保存失败抽屉停留时 750rpx 预览仍有数据可显示
		try {
			const resp = await saveBasics({ avatar: JSON.stringify({...avatarData.value, url: undefined}) })
			if (resp.code === 200) {
				// 刷新store
				await userStore.initUserInfo()
				router.navigateBack({})
			} else {
				toast(resp.msg)
				// 保存失败保持抽屉打开，允许调整后重试
				return Promise.reject()
			}
		} catch (err) {
			toastRequestError(err)
			// 网络异常同样保持抽屉打开，允许调整后重试
			return Promise.reject()
		}
	}
}
// 选择照片
const chooseImage = async () => {
  let filePath: string
  let croppedFilePath: string
  try {
    // 选择照片｜拍照（用户取消走 fail 回调，errMsg 各平台不一致，统一按放弃处理）
    filePath = await new Promise<string>((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (resp) => resolve(resp.tempFilePaths[0]),
        fail: reject,
      });
    });

    // 裁剪图片（用户取消裁剪同样走 fail）
    croppedFilePath = await new Promise<string>((resolve, reject) => {
      cropImage({
        // 图片压缩到一半的清晰度
        beforeCrop: () => 0.5,
        src: filePath,
        success: resolve,
        fail: reject,
      });
    });
  } catch {
    // 用户取消选图/裁剪，放弃本次上传
    return
  }

  // 获取图片信息（获取失败按放弃上传处理，避免未处理 Promise 异常）
  let size: number | undefined
  try {
    ({ size } = await getFileInfo(croppedFilePath))
  } catch (err) {
    console.error(err)
    toast("上传失败")
    return
  }

  // 限制 2MB
  if (!size || (size / 1024 / 1024 > 2)) {
    toast("上传失败，头像不能超过 2MB");
    return;
  }

  // 上传图片（loading/toast 共用原生槽位，hideLoading 须先于任何 toast，故不收在 finally）
  uni.showLoading({ title: "正在上传", mask: true });
  try {
    const resp = await upload(croppedFilePath, {businessCode: "UserAvatar", public: true});
    uni.hideLoading()
    if (resp.code === 200 && resp.data?.path) {
      avatarData.value.type = "image";
      avatarData.value.value = resp.data.path;
      // 失败提示已在 handleSave 内 toast，这里吞掉 reject 防止未处理 Promise 异常
      await handleSave("confirm")?.catch(() => undefined);
    } else {
      toast(resp.code === 200 ? "上传失败" : resp.msg);
    }
  } catch (err) {
    uni.hideLoading()
    console.error(err);
    toast("上传失败");
  }
}

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
	const handleKeyboardChange = ({ detail } : { detail : { height : number } }) => {
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
const { textPopout, autoFocus, keyboardOpen, handleTextAvatar, handleKeyboardChange } = initTextAvatar()
</script>

<style scoped lang="scss">
@import "@/static/style/input.scss";

.popout-content {
	padding-left: 32rpx;
	padding-right: 32rpx
}

:deep(.sar-popout__header) {
	height: 32rpx !important;
}
</style>
