<template>
	<view v-if="avatarData">
		<!-- 图片类型 -->
		<sar-avatar v-if="avatarData.type === 'image'" :src="avatarData.url" :size="size + 'rpx'"/>
		<!-- 文本|图标类型 -->
		<sar-avatar v-else :background="avatarData.backgroundColor" :size="size + 'rpx'" class="avatar-text">
			<sar-icon v-if="avatarData.type === 'icon'" :family="iconInfo?.family" :name="iconInfo?.name" color="#fff"/>
			<text v-else :style="{fontSize: fontSize + 'rpx', lineHeight: size + 'rpx'}" style="color: #fff">{{avatarData.value}}</text>
		</sar-avatar>
	</view>
	<!-- 默认头像 -->
	<sar-avatar v-else />
</template>

<script setup lang="ts">
import {onMounted, ref, defineProps, withDefaults} from "vue"
import type {AvatarType} from "@/api/system/profile/type/AvatarType"
import {useUserStore} from "@/stores/user"

// 接收参数
const {size, type, url, value, backgroundColor} = withDefaults(defineProps<{
	// 头像大小（rpx）
	size?: number,
	// 头像类型
	type?: string,
	// 路径（图片）
	url?: string,
	// 图标值（文本｜图标）
	value?: string,
	// 背景颜色（文本｜图标）
	backgroundColor?: string
}>(), {
	size: 128
})

const avatarData = ref<AvatarType>()
const fontSize = ref<number>(0)
const iconInfo = ref<{family: string, name: string}>()
const svgIconPath = "/static/icon/svg/"
const svgIconSuffix = ".svg"

/**
 * 加载头像
 */
const initAvatar = () => {
	// 传入type表示自定义显示
	if (type) {
		avatarData.value = {type, backgroundColor, value, url}
	} else {
		// type不存在，加载当前用户头像
		const userStore = useUserStore()
		avatarData.value = userStore.avatar
		if (avatarData.value.backgroundColor?.includes('conic-gradient')) {
			avatarData.value.backgroundColor = 'var(--sar-primary)'
		}
	}
	// 自适应文本尺寸
	autoFontSize()
	// 处理图标
	handleIcon()
}

/**
 * 自适应字号
 */
const autoFontSize = () => {
  if (avatarData.value?.type !== 'text') return

  const text = avatarData.value?.value
  if (!text) return

  // 计算加权长度：中文 1，英文 0.5，emoji 1.5
  let weightLen = 0
  for (const ch of text) {
    if (/[\u4e00-\u9fa5]/.test(ch)) {
		// 中文字符
		weightLen += 1  
    } else if (/[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(ch)) {
		// emoji
		weightLen += 1.5
    } else {
		// 英文、数字、符号
		weightLen += 0.5
    }
  }

  // 字号计算
  fontSize.value = (size * 0.8) / weightLen
}

// 处理图标
const handleIcon = () => {
	if (avatarData.value?.type !== 'icon') return
	
	const icon = avatarData.value?.value
	if (!icon) return
	
	// ant design 图标
	if (icon.endsWith("Outlined") || icon.endsWith("Filled") || icon.endsWith("TwoTone")) {
		iconInfo.value = {family: 'sari', name: icon}
	} else {
		// 自定义svg图标
		iconInfo.value = {family: '', name: svgIconPath + icon + svgIconSuffix}
	}
}

onMounted(() => {
	initAvatar()
})

</script>