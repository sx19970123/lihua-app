<template>
	<view>
		<!--头像-->
		<view style="background-color: var(--sar-primary);padding: 10vh 4vw 4vh 4vw">
			<sar-space align="center" size="large">
				<sar-avatar />
				<view>昵称</view>
			</sar-space>
		</view>
		<!--小轮播-->
		<view style="position: relative">
			<swiper
			  autoplay
			  :interval="3000"
			>
			  <swiper-item class="slide slide1">1</swiper-item>
			  <swiper-item class="slide slide2">2</swiper-item>
			  <swiper-item class="slide slide3">3</swiper-item>
			</swiper>
			<sar-swiper-dot
			  type="dot-bar"
			  field="title"
			/>
	  </view>
		<!--操作列表-->
		<view>
			
		</view>
	</view>
</template>

<script>
</script>

<style>
</style>