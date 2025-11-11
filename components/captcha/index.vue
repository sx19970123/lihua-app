<template>
	<view class="verify-wrap" v-if="verifyShow">
		<view class="verify-code">
			<!-- SLIDER  ROTATE  CONCAT 类型 -->
			<block v-if="captchaProcess.type !== 'WORD_IMAGE_CLICK'">
				<view class="verify-tip">拖动下方滑块完成拼图</view>
				<view class="verify-content">
					<view class="verify-body">
						<view class="verify-bg">
							<image id="bg" :src="captchaProcess.backgroundImage" mode="heightFix">
							</image>
						</view>
						<view v-if="captchaProcess.type === 'CONCAT'" id="verify-concat-bg" class="verify-concat-bg" :style="imgStyle">
						</view>
						<view v-else class="verify-slider" :style="imgStyle">
							<image id="slider-img" :src="captchaProcess.sliderImage" mode="heightFix"></image>
						</view>
						<view v-if="verifyResult.isSuccess" class="check-status check-success">
							<text>验证成功</text>
						</view>
						<view v-if="verifyResult.isError" class="check-status check-error">
							<text>{{ verifyResult.errorMsg }}</text>
						</view>
					</view>
					<view @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" v-if="isActive"
						class="move-area">
						<movable-area class="move-block" :animation="true">
							<view class="color-change" :style="{ width: colorWidth + 'px' }"></view>
							<view class="move-shadow"></view>
							<movable-view class="block-button" :x="x" :animation="true" direction="horizontal"
								@change="startMove">
								<text style="font-size: 50rpx"> → </text>
							</movable-view>
						</movable-area>
					</view>
				</view>
			</block>

			<!-- 点选 -->
			<view v-else class="verify-content">
				<view class="image-click-tips">
					<text>请依次点击:</text>
					<image :src="captchaProcess.sliderImage" mode="scaleToFill" />
				</view>
				<view class="verify-body">
					<view class="verify-bg">
						<image id="bg" :src="captchaProcess.backgroundImage" mode="heightFix">
						</image>
					</view>
					<view v-if="verifyResult.isSuccess" class="check-status check-success">
						<text>验证成功</text>
					</view>
					<view v-if="verifyResult.isError" class="check-status check-error">
						<text>{{ verifyResult.errorMsg }}</text>
					</view>
					<!-- 点击蒙层 -->
					<view id="image-click-mask" class="image-click-mask" @click="recordClickItem">
						<view v-for="(item, index) in captchaProcess.trackArr" :key="index" class="click-item"
							:style="{ left: `${item.x - 15}px`, top: `${item.y - 15}px` }">
							{{ index + 1 }}
						</view>
					</view>
				</view>
			</view>

			<!-- 刷新，关闭 操作区 -->
			<view class="verify-opts">
				<image class="opts-icon" @click="refresh" :src="refreshIcon" mode="aspectFill" />
				<view class="divide"></view>
				<image class="opts-icon" @click="verifyShow = false" :src="closeIcon" mode="aspectFill" />
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { computed, ref, nextTick } from "vue"
	import { getCaptchaData, check } from "@/api/system/captcha/Captcha"
	import type { CaptchaRequestData, CaptchaResponseData } from "@/api/system/captcha/type/CaptchaType"
	import { toast } from '@/uni_modules/sard-uniapp'
	
	const emits = defineEmits(['success'])
	
	// 图标类型
	type BaseImgType = {
		width ?: number,
		height ?: number,
		left ?: number,
		top ?: number
	}
	// 验证码执行需要的参数
	type CaptchaProcessType = {
		//当前生成的滑块ID, 后端生成
		id?: string,
		//滑块背景图
		backgroundImage?: string,
		//滑块图片
		sliderImage?: string,
		//起始时间
		startTime: Date,
		//停止时间
		stopTime?: Date,
		//滑动轨迹
		trackArr: Array<{ x : number, y : number, type : string, t : number }>,
		//滑动距离与背景图百分比
		movePercent?: number,
		//当前环境滑块背景宽
		backgroundImageWidth: number,
		//当前环境滑块背景高
		backgroundImageHeight: number,
		//当前环境滑块宽
		sliderImageWidth?: number,
		//当前环境滑块高
		sliderImageHeight?: number,
		// 开始时X轴坐标
		startX?: number,
		// 开始时Y轴坐标
		startY?: number,
		// x移动距离
		moveX?: number,
		//滑块滑动界限值
		end: number,
		// 验证码类型
		type?: 'WORD_IMAGE_CLICK' | 'CONCAT' | 'ROTATE' | 'SLIDER'
	}
	// 验证结果类型
	type VeriftResultType = {
		// 是否成功
		isSuccess: boolean,
		// 是否失败
		isError: boolean,
		// 错误信息
		errorMsg?: string
	}
	
	// 是否显示验证码
	const verifyShow = ref<boolean>(false)
	// 背景图片尺寸
	const bgImg = ref<BaseImgType>({})
	const sliderImg = ref<BaseImgType>({})
	// 验证码执行需要的参数
	const defaultCaptchaProcess = {startTime: new Date(), backgroundImageWidth: 0, backgroundImageHeight: 0, trackArr: [], end: 206}
	const captchaProcess = ref<CaptchaProcessType>(defaultCaptchaProcess)
	// 验证结果
	const verifyResult = ref<VeriftResultType>({isSuccess: false, isError: false})
	// 滑块初始位置
	const leftDistance = ref<number>(0)
	// 滑块x距离
	const x = ref<number>(0)
	// x滑动距离
	const xpos = ref<number>(0)
	const colorWidth = ref<number>(uni.upx2px(80))
	// 显示滑块
	const isActive = ref<boolean>(true)
	// 点击滑块次数
	const clickCount = ref<number>(0)
	// 刷新 关闭图标
	const refreshIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAJFBMVEVHcEyfn59xcXFgYGBbW1tYWFhYWFhXV1dYWFhXV1dXV1dXV1eOJtjUAAAAC3RSTlMAAgkQMUd0iKbR8IVomssAAABwSURBVHjapdFBDsMgDAXR7ya2MXP/+1ZNvUCwzNsxEkjY+vNRc9Zwk5p50aarBVTc13VHQUohKSGs7wRkIDm42nMCWRFaDECbADjbGT8PvTR/cosAqTMOLWKWCfZvukTuA5GU2+hCzYtWy0vW6+j0BSLdBQYxmJeMAAAAAElFTkSuQmCC"
	const closeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAHlBMVEVHcExiYmJeXl5YWFhYWFhZWVlYWFhYWFhXV1dXV1dh3LwmAAAACXRSTlMADRxPbYyl1/NFQhX5AAAAd0lEQVR42m2R0QoDMQgEx+hl3f//4dLmeqXgPIQwIOrKIbe6tZMfKd/o0ZetWhGrZF9f18VN9bHpTh6ynYBcQHA/ZUFawKUFSxcgJ9sFIWstWQHljbyAt5D1+Vq0g2OPI9yjHMvHRuNI4/DzmnMgc3RzyBD/53gBSd8FOjnClmAAAAAASUVORK5CYII="
	
	/**
	 * 打开
	 */
	const open = () => {
		verifyShow.value = true
		getCaptcha()
	}
	
	/**
	 * 关闭
	 */
	const close = () => {
		verifyShow.value = false
		nextTick(() => {
			captchaProcess.value = defaultCaptchaProcess
			refresh(false)
		})
	}
	
	/**
	 * 初始化验证码
	 */
	const initCaptchaData = () => {
		// 加载验证码和滑块
		const getCaptcha = async () => {
			try {
				const captchaResp = await getCaptchaData()
				if (captchaResp.code === 200) {
					const data = captchaResp.data
					captchaProcess.value.type = data.type
					captchaProcess.value.id = data.id
					captchaProcess.value.backgroundImage = data.backgroundImage
					captchaProcess.value.sliderImage = data.templateImage
					nextTick(() => {
						// 加载背景
						initBackground()
						// 根据验证码类型加载
						switch (data.type) {
							case "ROTATE":
							case "SLIDER":
								initRoateAndSlider()
								break
							case "CONCAT":
								initConcat(data)
								break
							case "WORD_IMAGE_CLICK":
								initWordClick()
								break
						}
						// 加载验证码运行时需要的参数
						initProcess()
					})
				}
			} catch(err) {
				console.error(err);
			}
		}

		/**
		 * 加载背景图
		 */
		const initBackground = () => {
			const query = uni.createSelectorQuery().in(this)
			query
				.select("#bg")
				.boundingClientRect((data) => {
					if (!Array.isArray(data)) {
						bgImg.value.width = data.width
						bgImg.value.height = data.height
					}
				}).exec();
		}

		/**
		 * 加载旋转和滑块验证码
		 */
		const initRoateAndSlider = () => {
			const query = uni.createSelectorQuery().in(this)
			query
				.select("#slider-img")
				.boundingClientRect((data) => {
					if (!Array.isArray(data)) {
						sliderImg.value.width = data.width
						sliderImg.value.height = data.height
					}
				}).exec();
		}

		/**
		 * 加载拼接验证码
		 */
		const initConcat = (captchaData : CaptchaResponseData) => {
			const query = uni.createSelectorQuery().in(this)
			query
				.select("#verify-concat-bg")
				.boundingClientRect((data) => {
					if (!Array.isArray(data) && captchaData && captchaData.backgroundImageHeight && captchaData.data?.randomY) {
						const height = ((captchaData.backgroundImageHeight - captchaData.data.randomY) / captchaData.backgroundImageHeight) * uni.upx2px(captchaData.backgroundImageHeight);
						sliderImg.value.height = height
					}
				}).exec();
		}

		/**
		 * 加载点选验证码
		 */
		const initWordClick = () => {
			const query = uni.createSelectorQuery().in(this)
			query
				.select("#image-click-mask")
				.boundingClientRect((data) => {
					if (!Array.isArray(data)) {
						sliderImg.value.left = data.left
						sliderImg.value.top = data.top
					}
				}).exec();
		}

		/**
		 * 初始化验证码运行时数据
		 */
		const initProcess = () => {
			captchaProcess.value.backgroundImageWidth = Math.round(bgImg.value.width || 0)
			captchaProcess.value.backgroundImageHeight = Math.round(bgImg.value.height || 0)
			captchaProcess.value.sliderImageWidth = Math.round(sliderImg.value.width || 0)
			captchaProcess.value.sliderImageHeight = Math.round(sliderImg.value.height || 0)
			captchaProcess.value.end = Math.round(bgImg.value.width || 0 - uni.upx2px(40))
		}
		
		return {
			getCaptcha
		}
	}
	
	const {getCaptcha} = initCaptchaData()
	
	/**
	 * 初始化验证码交互
	 */
	const initInteraction = () => {
		// 滑块开始
		const touchstart = (e: TouchEvent) => {
			let startX = e.changedTouches[0].pageX
			let startY = e.changedTouches[0].pageY
			captchaProcess.value.startX = startX
			captchaProcess.value.startY = startY
			
			const startTime = captchaProcess.value.startTime
			const trackArr = captchaProcess.value.trackArr
			
			const track = {
				x: 0, 
				y: 0, 
				type: 'down', 
				t: new Date().getTime() - startTime?.getTime()
			}
			trackArr.push(track)
		}
		// 滑块滑动中
		const touchmove = (e: TouchEvent) => {
			let pageX = Math.round(e.changedTouches[0].pageX)
			let pageY = Math.round(e.changedTouches[0].pageY)
			
			const startX = captchaProcess.value.startX || 0
			const startY = captchaProcess.value.startY || 0
			const startTime = captchaProcess.value.startTime
			const end = captchaProcess.value.end
			const bgImageWidth = captchaProcess.value.backgroundImageWidth
			const trackArr = captchaProcess.value.trackArr
			let moveX = pageX - startX
			
			const track = {
			  x: pageX - startX,
			  y: pageY - startY,
			  type: "move",
			  t: new Date().getTime() - startTime.getTime()
			}
			trackArr.push(track)
			
			if (moveX < 0) {
			  moveX = 0;
			} else if (moveX > end) {
			  moveX = end;
			}
			
			captchaProcess.value.moveX = moveX
			captchaProcess.value.movePercent = moveX / bgImageWidth
		}
		// 滑块结束
		const touchend = (e: TouchEvent) => {
			captchaProcess.value.stopTime = new Date()
			let pageX = Math.round(e.changedTouches[0].pageX)
			let pageY = Math.round(e.changedTouches[0].pageY)
			const startX = captchaProcess.value.startX || 0
			const startY = captchaProcess.value.startY || 0
			const startTime = captchaProcess.value.startTime
			const trackArr = captchaProcess.value.trackArr
			const track = {
			  x: pageX - startX,
			  y: pageY - startY,
			  type: "up",
			  t: new Date().getTime() - startTime.getTime()
			};
			 trackArr.push(track)
			 vertifyData()
		}
		// 滑块绑定卡片移动距离
		const startMove = (e: { detail: { x: number } }) => {
			xpos.value = e.detail.x
			nextTick(() => {
				colorWidth.value = xpos.value + uni.upx2px(80)
				leftDistance.value = xpos.value
			})
		}
		// 点选
		const recordClickItem = (e: TouchEvent) => {
			if (!sliderImg.value.left || !sliderImg.value.top) {
				return
			}
			
			const x = e.touches[0].pageX
			const y = e.touches[0].pageY
			
			const relativeX = sliderImg.value.left - x
			const relativeY = sliderImg.value.top - y
		
			clickCount.value ++
			
			const startTime = captchaProcess.value.startTime
			
			if (clickCount.value > 4) {
			  return;
			}
			
			captchaProcess.value.stopTime = new Date()
			
			const track = {
			  x: Math.abs(relativeX),
			  y: Math.abs(relativeY),
			  type: "click",
			  t: new Date().getTime() - startTime.getTime()
			};
			
			captchaProcess.value.trackArr.push(track)
			
			if (clickCount.value == 4) {
			  vertifyData()
			}
		}
		
		return {
			touchstart, touchmove, touchend, startMove, recordClickItem
		}
	}
	
	const {touchstart, touchmove, touchend, startMove, recordClickItem} = initInteraction()
	
	/**
	 * 刷新
	 */
	const refresh = (reget: boolean = true) => {
		isActive.value = false
		nextTick(() => isActive.value = true)
		colorWidth.value = 0
		x.value = xpos.value
		nextTick(() => {
			x.value = 0
			colorWidth.value = uni.upx2px(80)
		})
		verifyResult.value.isError = false
		verifyResult.value.isSuccess = false
		verifyResult.value.errorMsg = undefined
		leftDistance.value = 0
		clickCount.value = 0
		captchaProcess.value.trackArr = []
		if (reget) {
			getCaptcha()
		}
		
	}
	
	// 滑动校验
	const vertifyData = async () => {
		// 参数拼接与校验
		const {id, backgroundImageWidth, backgroundImageHeight, startTime, stopTime, trackArr} = captchaProcess.value
		if (!id || !stopTime) {
			return
		}
		const captchaData: CaptchaRequestData = {
			id: id,
			data: {
				bgImageWidth: backgroundImageWidth,
				bgImageHeight: backgroundImageHeight,
				startTime: startTime.getTime(),
				stopTime: stopTime.getTime(),
				trackList: trackArr
			}
		}
		
		try {
			// 验证
			const resp = await check(captchaData)

			// 校验成功
			if (resp.code === 200 && resp.success) {
				verifyResult.value.isSuccess = true
				setTimeout(() => {
					close()
					emits('success', resp.data.id)
				}, 1000)
			} else {
				// 校验失败
				verifyResult.value.isError = true
				switch(resp.code) {
					case 4001:
						verifyResult.value.errorMsg = "验证失败，请重新尝试！"
						break
					case 4000:
						verifyResult.value.errorMsg = "验证码被黑洞吸走了！"
						break
					default:
						verifyResult.value.errorMsg = resp.msg
				}
				setTimeout(() => {
					refresh()
				}, 750)
			}
		} catch(err) {
			// 异常刷新
			console.error(err)
			refresh()
		}
	}
	
	// 滑块样式变化
	const imgStyle = computed(() => {
		switch (captchaProcess.value.type) {
			case "ROTATE":
				const angle = leftDistance.value / (captchaProcess.value.end / 360)
				return `transform:translate(100%,0) rotate(${angle - 5}deg);`
			case "SLIDER":
				return `left: ${leftDistance.value}px;`;
			case "CONCAT":
				return `background-position:${leftDistance.value}px 0;background-image:url(${captchaProcess.value.backgroundImage});background-size: cover;height:${sliderImg.value.height}px`;
			default: 
				return ''
		}
	})
	
	// 向外部抛出方法
	defineExpose({ open })
</script>

<style scoped lang="scss">
	.verify-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		overflow: hidden;

		.verify-code {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 640rpx;
			max-height: 740rpx;
			background-color: #ffffff;
			padding: 40rpx 0 20rpx;
			z-index: 999;
			box-shadow: 0 0 10rpx rgba(227, 227, 227, 0.7);
			border-radius: 10px;
			overflow: hidden;

			.verify-tip {
				font-size: 32rpx;
				font-weight: bold;
				color: #686868;
				padding: 0 20rpx;
			}

			.verify-content {
				width: 100%;
				padding: 20rpx 20rpx;
				background-color: #ffffff;
				box-sizing: border-box;
				overflow: hidden;

				.verify-concat-bg {
					width: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}

				.image-click-tips {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 40rpx;

					image {
						width: 420rpx;
						height: 80rpx;
					}
				}

				.image-click-mask {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 999;

					.click-item {
						position: absolute;
						left: 0;
						top: 0;
						z-index: 1000;
						border-radius: 50px;
						background-color: #409eff;
						width: 50rpx;
						height: 50rpx;
						text-align: center;
						line-height: 50rpx;
						color: #fff;
						border: 4rpx solid #fff;
						box-sizing: content-box;
					}
				}

				.verify-body {
					width: 100%;
					height: 360rpx;
					border-radius: 6px;
					position: relative;
					overflow: hidden;

					.verify-bg {
						width: 100%;
						height: 100%;
						position: absolute;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.verify-slider {
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;

						image {
							overflow: hidden;
							width: 55px;
							height: 100%;
							position: relative;
						}
					}
				}

				.move-area {
					overflow: hidden;
					width: 100%;
					height: 80rpx;
					margin-top: 20rpx;
				}

				.move-block {
					width: 100%;
					height: 100%;
					background-color: #f0f0f0;
					border-radius: 100rpx;
					position: relative;
					overflow: hidden;

					.move-shadow {
						height: 100%;
						width: 4px;
						background-color: rgba(255, 255, 255, 0.5);
						position: absolute;
						top: 0;
						left: 0;
						box-shadow: 1px 1px 1px #fff;
						border-radius: 50%;
						animation: moveAnimate 2s linear infinite;
					}

					@keyframes moveAnimate {
						0% {
							left: 0;
							opacity: 0.5;
						}

						50% {
							left: 50%;
							opacity: 1;
						}

						100% {
							left: 100%;
							opacity: 0.5;
						}
					}

					.color-change {
						height: 80rpx;
						border-radius: 100rpx;
						background-color: #c6a876;
						z-index: 2;
					}

					.block-button {
						border-radius: 100rpx;
						background-color: #b48d4d;
						height: 80rpx;
						width: 80rpx;
						margin-top: -10rpx;
						touch-action: none;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						color: #fff;
					}
				}

				.check-status {
					position: absolute;
					left: 0;
					right: 0;
					bottom: -1px;
					height: 50rpx;
					line-height: 50rpx;
					width: 100%;
					text-align: center;
					font-size: 24rpx;
					color: #fff;

					&.check-success {
						background: #5ac725;
					}

					&.check-error {
						background: #f56c6c;
					}
				}
			}

			.verify-opts {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin: 0 20rpx;

				.opts-icon {
					width: 40rpx;
					height: 40rpx;

					&:nth-last-child(1) {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.divide {
					height: 20px;
					width: 40rpx;
				}
			}
		}
	}
</style>