<template>
	<view class="content">
		<sar-space direction="vertical">
			<view class="model-val">双向绑定颜色：{{color}}</view>
			<view class="model-val">双向绑定Key：{{value}}</view>
			<!-- 头像背景颜色 -->
			<color-select :dataSource="AVATAR_COLOR_SOURCE" v-model:color="color" v-model:value="value"></color-select>
		</sar-space>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ColorSelect from '@/components/color-select/index.vue'
import { AVATAR_COLOR_SOURCE } from '@/constants/avatar-colors'

const color = ref<string>('rgb(114, 46, 209)')
const value = ref<string>('8')
</script>

<style scoped lang="scss">
.model-val {
	max-width: 100vw;
	overflow-wrap: break-word;
	font-size: var(--sar-text-sm);
}
</style>