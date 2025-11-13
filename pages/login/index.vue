<template>
	<view class="login-body">
		<view class="login-content">
			<sar-space direction="vertical" justify="center" size="large">
				<text class="login-title">密码登录</text>
				<sar-input placeholder="用户名" root-class="login-item">
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" name="person" />
					</template>
				</sar-input>	
				<sar-input placeholder="密码" root-class="login-item">
					<template #prepend>
						<sar-icon color="var(--sar-tertiary-color)" name="person" />
					</template>
				</sar-input>
				<sar-button root-class="login-item login-item-btn">登 录</sar-button>
				<sar-button type="pale-text">注册账号</sar-button>
			</sar-space>
		</view>
	</view>
</template>

<script>

</script>
<style scoped lang="scss">
	.login-body {
		display: flex;
		justify-content: center;
		align-items: flex-start; 
		padding: 48rpx;
		
		.login-content {
			width: 100%;
			margin-top: 25%;
			
			.login-title {
				font-size: 32rpx;  
				margin-bottom: 32rpx;
				font-weight: bold;  
				line-height: 40rpx;
				text-align: center;
			}
			
			.login-item {
				height: 90rpx; 
				border-radius: 24rpx;
			}
			
			.login-item-btn {
				margin-top: 64rpx;
			}
		}
	}
</style>