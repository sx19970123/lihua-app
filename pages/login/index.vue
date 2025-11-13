<template>
	<view class="login-body">
		<view class="login-content">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="login-title">欢迎登录狸花猫</text>
				<sar-space align="center" size="0rpx">
					<text class="text-font">没有账号？</text>	
					<sar-button type="pale-text" inline root-class="text-btn">快速注册<sar-icon name="right"/></sar-button>
				</sar-space>
				<sar-input placeholder="用户名" root-class="login-item">
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="user" />
					</template>
				</sar-input>	
				<sar-input placeholder="密码" root-class="login-item">
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" family="icon" name="lock"/>
					</template>
				</sar-input>
				<sar-checkbox><text class="text-font">记住账号</text></sar-checkbox>
				<sar-button root-class="login-item login-item-btn">登 录</sar-button>
			</sar-space>
		</view>
		<view class="protocol">
			<sar-space align="center" size="0rpx">
				<sar-checkbox type="circle">我已阅读并同意</sar-checkbox>
				<sar-button type="pale-text" inline root-class="text-btn">用户协议</sar-button>
					与
				<sar-button type="pale-text" inline root-class="text-btn">隐私政策</sar-button>
			</sar-space>
		</view>
	</view>
</template>

<script lang="ts" setup>

</script>
<style lang="scss">
	.login-body {
		padding: 48rpx;
		
		.login-content {
			width: 100%;
			margin-top: 25%;
			
			.login-title {
				font-size: 48rpx;  
				margin-bottom: 32rpx;
				font-weight: bold;  
				line-height: 40rpx;
			}
			
			.login-item {
				height: 90rpx; 
				border-radius: 24rpx;
			}
			
			.login-item-btn {
				margin-top: 64rpx;
			}
		}
		
		.protocol {
			position: fixed;
			bottom: 64rpx;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
			color: var(--sar-tertiary-color);
		}
		
		.text-btn {
			padding: 0 !important;
		}
		.text-font {
			font-size: var(--sar-text-base)
		}
	}
</style>