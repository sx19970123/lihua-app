<template>
	<view class="content">
		<sar-space direction="vertical" size="large">
			<sar-space direction="vertical">
				<view class="title">使用说明</view>
				<view class="description">· 仅原生 App（Android/iOS）：plus.nativeObj.View 原生绘制层，全局单例、任意页面可弹、无视路由切换；小程序/H5 无实现，多端使用需条件编译</view>
				<view class="description">· 原生层无 CSS：卡片与投影由 alpha 阴影床 PNG 模拟（亮暗主题各一张自动切换，显示中切换即时重绘）；文字超宽自动截断补省略号</view>
				<view class="description">· 横幅宽度自适应视口并居中，平板等宽屏可用 maxWidth 指定横幅最大宽度（缺省 440）；高度固定，随宽度等比缩放</view>
				<view class="description">· 左侧图标固定方形区域自动拉伸：请传正方形图（非正方形会变形），建议分辨率 ≥156px（3x 屏）；原生层无圆角裁剪，圆角/异形轮廓需图片自带 alpha 透明底</view>
				<view class="description">· duration 缺省 3000ms，每条通知重置；无队列，新消息直接替换旧横幅（拖动中到达则原位重绘）</view>
				<view class="description">· 交互：点击=回调后关闭；下滑=回调 direction 'bottom'（业务可联动抽屉预览）；左右/上滑关闭；Android 受官方 touchend 缺陷限制仅支持上滑关闭与点击</view>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">基础使用</view>
				<sar-button @click="show('测试通知', '测试内容')"> 显示通知</sar-button>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">自定义消失时间(10s)</view>
				<sar-button @click="show('测试通知', '测试内容', undefined, 10000)"> 显示通知</sar-button>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">自定义图片</view>
				<view class="description">需正方形且自带透明轮廓（圆角需图片自身 alpha，组件不裁剪）</view>
				<sar-button @click="show('测试通知', '测试内容', '_www/static/logo-miao.png')"> 显示通知</sar-button>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">横幅最大宽度（平板限宽场景）</view>
				<view class="description">maxWidth 指可见横幅宽度上限（仅收窄不撑大），缺省 440：未指定时手机纯自适应、平板被缺省截住；指定值大于自适应宽度时自动沿用自适应</view>
				<sar-space>
					<sar-button @click="show('限宽600', '平板等宽屏横幅更宽', undefined, undefined, 600)">限宽 600</sar-button>
					<sar-button @click="show('限宽320', '窄横幅居中显示', undefined, undefined, 320)">限宽 320</sar-button>
				</sar-space>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">超长文本</view>
				<sar-button @click="show('这是一段很长的标题这是一段很长的标题这是一段很长的标题这是一段很长的标题', '这是一段很长的内容这是一段很长的内容这是一段很长的内容这是一段很长的内容这是一段很长的内容这是一段很长的内容')"> 显示通知</sar-button>
			</sar-space>

			<sar-space direction="vertical">
				<view class="title">回调函数</view>
				<view class="description">点击回调（跳转详情等业务）；滑动结束回调 direction：right/left/top/bottom</view>
				<sar-button @click="callbackShow"> 显示通知</sar-button>
			</sar-space>
			<sar-button @click="MessageNotify.hide()"> 隐藏通知</sar-button>
		</sar-space>

	</view>
</template>


<script setup lang="ts">
import MessageNotify from '@/utils/message-notify'
import {toast} from '@/utils/toast'

const show = (title: string, content: string, image?: string, duration?: number, maxWidth?: number) => {
	MessageNotify.show({title: title, content: content, image: image, duration: duration, maxWidth: maxWidth})
}

const callbackShow = () => {
	MessageNotify.show({content: "测试内容"}, () => {
		toast("点击了通知")
	}, (direction) => {
		toast("滑动方向" + direction)
	})
}
</script>


<style scoped lang="scss">
.title {
	font-size: var(--sar-text-lg);
	font-weight: var(--sar-font-bold);
}
.model-val {
	max-width: 100vw;
	overflow-wrap: break-word;
	font-size: var(--sar-text-sm);
}
.description {
	font-size: var(--sar-text-sm);
	color: var(--sar-secondary-color);
}
</style>
