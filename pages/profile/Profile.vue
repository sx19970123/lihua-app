<template>
	<view>
		<!--头像-->
		<view class="title">
			<sar-space align="center" size="large">
				<sar-avatar />
				<view>昵称</view>
			</sar-space>
		</view>
		<!--操作列表-->
		<view style="padding: 16px;">
			<sar-list card>
				<sar-list-item title="仓库" value="值" hover arrow/>
				<sar-list-item title="关于" value="值" hover arrow/>
				<sar-list-item title="设置" value="值" hover arrow/>
			</sar-list>
		</view>
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
.title {
    /* 主渐变 */
    background-image:
		linear-gradient(to top, #f7f7f8 0%, #f0faff 30%, #99caf9 100%),
		repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 20px, rgba(255,255,255,0) 20px 40px),
		repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 10px, rgba(255,255,255,0) 10px 20px),
		repeating-linear-gradient(-45deg,rgba(255,255,255,0.08) 0 10px,rgba(255,255,255,0) 10px 20px);
		background-blend-mode: overlay;
		padding: 10vh 16px 4vh 16px;
}

@media(prefers-color-scheme: dark) {
.title {
	background-image:
		linear-gradient(to top, #000000 0%, #121529 30%, #3a557f 100%),
		repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 20px, rgba(0,0,0,0) 20px 40px),
		repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px),
		repeating-linear-gradient(-45deg,rgba(0,0,0,0.08) 0 10px, rgba(0,0,0,0) 10px 20px);
		
	}
}
</style>