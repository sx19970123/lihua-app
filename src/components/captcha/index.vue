<template>
	<view class="verify-wrap" :class="{ 'theme-dark': themeStore.isDark }" @touchmove.stop.prevent @touchMove.stop.prevent v-if="verifyShow">
		<view class="verify-code">
			<!-- 切换动画 -->
			<view class="captcha-loading" v-show="captchaLoading"></view>
			<view class="loading-error" v-if="!captchaLoading && loadingError">{{loadingError}}</view>
			<view :class="captchaTransition" v-if="!loadingError">
				<!-- SLIDER  ROTATE  CONCAT 类型 -->
				<block v-if="captchaProcess.type !== 'WORD_IMAGE_CLICK'">
					<view class="verify-tip">拖动滑块完成拼图</view>
					<view class="verify-content">
						<view class="verify-body">
							<view class="verify-bg">
								<!-- 图片背景 -->
								<image id="bg" :src="captchaProcess.backgroundImage" mode="heightFix"></image>
							</view>
							<!-- 拼接 -->
							<view v-if="captchaProcess.type === 'CONCAT'" 
								id="verify-concat-bg" 
								class="verify-concat-bg"
								:style="imgStyle"></view>
								<!-- 滑块 -->
							<view v-else class="verify-slider" :style="imgStyle">
								<image id="slider-img" :src="captchaProcess.sliderImage" mode="heightFix"></image>
							</view>
								<!-- 旋转 -->
							<view v-if="verifyResult.isSuccess" class="check-status check-success">
								<text class="check-msg">{{verifyResult.successMsg}}</text>
							</view>
							<view v-if="verifyResult.isError" class="check-status check-error">
								<text class="check-msg">{{ verifyResult.errorMsg }}</text>
							</view>
						</view>
						<view v-if="isActive" class="move-area">
							<movable-area class="move-block" :animation="true">
								<view class="color-change" :style="{ width: colorWidth + 'px' }"></view>
								<view class="move-shadow"></view>
							<movable-view class="block-button" :x="x" :animation="true" direction="all"
								@change="startMove" @touchstart="touchstart" @touchmove="touchmove"
								@touchend="touchend" @mousedown="mousedown" @mousemove="mousemove">
									<text class="arrow">
										➜
									</text>
								</movable-view>
							</movable-area>
						</view>
					</view>
				</block>

				<!-- 点选 -->
				<view v-else class="verify-content">
					<view class="image-click-tips">
						<text class="verify-tip">请依次点击:</text>
						<image :src="captchaProcess.sliderImage" mode="scaleToFill" />
					</view>
					<view class="verify-body">
						<view class="verify-bg">
							<image id="bg" :src="captchaProcess.backgroundImage" mode="heightFix">
							</image>
						</view>
						<view v-if="verifyResult.isSuccess" class="check-status check-success">
							<text class="check-msg">{{verifyResult.successMsg}}</text>
						</view>
						<view v-if="verifyResult.isError" class="check-status check-error">
							<text class="check-msg">{{ verifyResult.errorMsg }}</text>
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
			</view>
			<!-- 校验期间透明阻断层：提交后到刷新前禁止拖动/点击，不遮底部操作图标 -->
			<view class="verify-freeze" v-if="verifying" @touchmove.stop.prevent @touchMove.stop.prevent></view>
			<!-- 刷新，关闭 操作区 -->
			<view class="verify-opts">
				<image class="opts-icon" @click="refresh(false)" :src="refreshIcon" mode="aspectFill" />
				<view class="divide"></view>
				<image class="opts-icon" @click="close" :src="closeIcon" mode="aspectFill" />
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { onMounted, onUnmounted, computed, ref, nextTick, getCurrentInstance } from "vue"
	import type { ComponentInternalInstance } from 'vue'
	import { getCaptchaData, check } from "@/api/system/captcha/captcha"
	import type { CaptchaRequestData, CaptchaResponseData } from "@/api/system/captcha/type/captcha-type"
	import { useThemeStore } from "@/stores/theme"
	// 抛出方法
	const emits = defineEmits(['success'])
	const themeStore = useThemeStore()

	// 图标类型
	type BaseImgType = {
		width ?: number,
		height ?: number,
		left ?: number,
		top ?: number
	}
	// uni-app 运行时挂在组件代理上的页面作用域（selectorQuery.in 的查询范围，官方类型未定义该属性）
	type UniPageScope = NonNullable<ComponentInternalInstance['proxy']> & { $scope?: unknown }
	// 验证码执行需要的参数
	type CaptchaProcessType = {
		//当前生成的滑块ID, 后端生成
		id ?: string,
		//滑块背景图
		backgroundImage ?: string,
		//滑块图片
		sliderImage ?: string,
		//起始时间
		startTime : Date,
		//停止时间
		stopTime ?: Date,
		//滑动轨迹
		trackArr : Array<{ x : number, y : number, type : string, t : number }>,
		//滑动距离与背景图百分比
		movePercent ?: number,
		//当前环境滑块背景宽
		backgroundImageWidth : number,
		//当前环境滑块背景高
		backgroundImageHeight : number,
		//当前环境滑块宽
		sliderImageWidth ?: number,
		//当前环境滑块高
		sliderImageHeight ?: number,
		// 开始时X轴坐标
		startX ?: number,
		// 开始时Y轴坐标
		startY ?: number,
		// x移动距离
		moveX ?: number,
		//滑块滑动界限值
		end : number,
		// 验证码类型
		type ?: 'WORD_IMAGE_CLICK' | 'CONCAT' | 'ROTATE' | 'SLIDER'
	}
	// 验证结果类型
	type VerifyResultType = {
		// 是否成功
		isSuccess : boolean,
		// 是否失败
		isError : boolean,
		// 成功信息
		successMsg ?: string
		// 错误信息
		errorMsg ?: string
	}

	// 是否显示验证码
	const verifyShow = ref<boolean>(false)
	// 背景图片尺寸
	const bgImg = ref<BaseImgType>({})
	const sliderImg = ref<BaseImgType>({})
	// 验证码执行需要的参数（每次重置须取新对象，勿共享可变默认值）
	const createDefaultCaptchaProcess = () : CaptchaProcessType => ({ startTime: new Date(), backgroundImageWidth: 0, backgroundImageHeight: 0, trackArr: [], end: 206 })
	const captchaProcess = ref<CaptchaProcessType>(createDefaultCaptchaProcess())
	// 验证结果
	const verifyResult = ref<VerifyResultType>({ isSuccess: false, isError: false })
	// 滑块初始位置
	const leftDistance = ref<number>(0)
	// 滑块x距离
	const x = ref<number>(0)
	// x滑动距离
	const xpos = ref<number>(0)
	const colorWidth = ref<number>(uni.upx2px(80))
	// 过度动效
	const captchaTransition = ref<'slide-in' | 'slide-out' | 'slide-hidden' | ''>('')
	const captchaLoading = ref<boolean>(false)
	// 显示滑块
	const isActive = ref<boolean>(true)
	// 点击滑块次数
	const clickCount = ref<number>(0)
	const instanceScope = ref<ComponentInternalInstance>();
	// 连接失败
	const loadingError = ref<string>()
	// 成功/失败后的延时任务句柄（刷新、关闭、卸载时须清理）
	let verifyTimer: ReturnType<typeof setTimeout> | undefined
	// 校验进行中（提交后到下次刷新前），期间透明阻断层盖住游戏区
	const verifying = ref<boolean>(false)
	// 刷新 关闭图标
	const refreshIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAJFBMVEVHcEyfn59xcXFgYGBbW1tYWFhYWFhXV1dYWFhXV1dXV1dXV1eOJtjUAAAAC3RSTlMAAgkQMUd0iKbR8IVomssAAABwSURBVHjapdFBDsMgDAXR7ya2MXP/+1ZNvUCwzNsxEkjY+vNRc9Zwk5p50aarBVTc13VHQUohKSGs7wRkIDm42nMCWRFaDECbADjbGT8PvTR/cosAqTMOLWKWCfZvukTuA5GU2+hCzYtWy0vW6+j0BSLdBQYxmJeMAAAAAElFTkSuQmCC"
	const closeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAHlBMVEVHcExiYmJeXl5YWFhYWFhZWVlYWFhYWFhXV1dXV1dh3LwmAAAACXRSTlMADRxPbYyl1/NFQhX5AAAAd0lEQVR42m2R0QoDMQgEx+hl3f//4dLmeqXgPIQwIOrKIbe6tZMfKd/o0ZetWhGrZF9f18VN9bHpTh6ynYBcQHA/ZUFawKUFSxcgJ9sFIWstWQHljbyAt5D1+Vq0g2OPI9yjHMvHRuNI4/DzmnMgc3RzyBD/53gBSd8FOjnClmAAAAAASUVORK5CYII="

	/**
	 * 打开
	 */
	const open = () => {
		verifyShow.value = true
		getCaptcha(true)
	}

	/**
	 * 关闭
	 */
	const close = () => {
		verifyShow.value = false
		nextTick(() => {
			captchaProcess.value = createDefaultCaptchaProcess()
			refresh(true)
		})
	}

	/**
	 * 初始化验证码
	 */
	const initCaptchaData = () => {
		// 加载验证码和滑块
		const getCaptcha = async (isShow : boolean = false) => {
			try {
				captchaLoading.value = true
				// 第一次打开时不展示移除动画
				if (!isShow && !loadingError.value) {
					captchaTransition.value = 'slide-out'
					await new Promise(r => setTimeout(r, 300))
				}
				loadingError.value = undefined
				// 动画执行完成后隐藏，并重置transformX为0，防止影响点选
				captchaTransition.value = 'slide-hidden'
				const captchaResp = await getCaptchaData()
				if (captchaResp.code === 200) {
					const data = captchaResp.data
					captchaProcess.value.type = data.type
					captchaProcess.value.id = data.id
					captchaProcess.value.backgroundImage = data.backgroundImage
					captchaProcess.value.sliderImage = data.templateImage
					// 等待dom更新完成
					await nextTick()
					const scope = (instanceScope.value?.proxy as UniPageScope | undefined)?.$scope
					// 加载背景
					await initBackground(scope)
					// 根据验证码类型加载
					switch (data.type) {
						case "ROTATE":
						case "SLIDER":
							await initRotateAndSlider(scope)
							break
						case "CONCAT":
							await initConcat(data, scope)
							break
						case "WORD_IMAGE_CLICK":
							await initWordClick(scope)
							break
					}
					// 加载验证码运行时需要的参数
					initProcess()
					// 加载完成后执行进入动画
					captchaTransition.value = 'slide-in'
					await new Promise(r => setTimeout(r, 300))
					captchaLoading.value = false
				} else {
					// 非 200 也要结束加载态并提示，否则永久停在 loading
					captchaTransition.value = ''
					captchaLoading.value = false
					loadingError.value = '验证码加载失败'
				}
			} catch (err) {
				console.error(err);
				captchaTransition.value = ''
				captchaLoading.value = false
				loadingError.value = '验证码加载失败'
			}
		}

		/**
		 * 加载背景图
		 */
		const initBackground = (scope : unknown) => {
			return new Promise<void>((resolve, reject) => {
				const query = uni.createSelectorQuery().in(scope)
				query
					.select("#bg")
					.boundingClientRect((data) => {
						if (data && !Array.isArray(data)) {
							bgImg.value.width = data.width
							bgImg.value.height = data.height
							resolve()
						} else {
							reject()
						}
					}).exec();
			})
		}

		/**
		 * 加载旋转和滑块验证码
		 */
		const initRotateAndSlider = (scope : unknown) => {
			return new Promise<void>((resolve, reject) => {
				const query = uni.createSelectorQuery().in(scope)
				query
					.select("#slider-img")
					.boundingClientRect((data) => {
						if (data && !Array.isArray(data)) {
							sliderImg.value.width = data.width
							sliderImg.value.height = data.height
							resolve()
						} else {
							reject()
						}
					}).exec();
			})
		}

		/**
		 * 加载拼接验证码
		 */
		const initConcat = (captchaData : CaptchaResponseData, scope : unknown) => {
			return new Promise<void>((resolve, reject) => {
				const query = uni.createSelectorQuery().in(scope)
				query
					.select("#verify-concat-bg")
						.boundingClientRect((data) => {
							// randomY 可为合法的 0，只做空值判断
							if (data && !Array.isArray(data) && captchaData && captchaData.backgroundImageHeight && captchaData.data?.randomY != null) {
							const height = ((captchaData.backgroundImageHeight - captchaData.data.randomY) / captchaData.backgroundImageHeight) * uni.upx2px(captchaData.backgroundImageHeight);
							sliderImg.value.height = height
							resolve()
						} else {
							reject()
						}
					}).exec();
			})

		}

		/**
		 * 加载点选验证码
		 */
		const initWordClick = (scope : unknown) => {
			return new Promise<void>((resolve, reject) => {
				const query = uni.createSelectorQuery().in(scope)
				query
					.select("#image-click-mask")
					.boundingClientRect((data) => {
						if (data && !Array.isArray(data)) {
							sliderImg.value.left = data.left
							sliderImg.value.top = data.top
							resolve()
						} else {
							reject()
						}
					}).exec();
			})
		}

		/**
		 * 初始化验证码运行时数据
		 */
		const initProcess = () => {
			captchaProcess.value.backgroundImageWidth = Math.round(bgImg.value.width || 0)
			captchaProcess.value.backgroundImageHeight = Math.round(bgImg.value.height || 0)
			captchaProcess.value.sliderImageWidth = Math.round(sliderImg.value.width || 0)
			captchaProcess.value.sliderImageHeight = Math.round(sliderImg.value.height || 0)
			// 拖动上限 = 背景宽 - 滑块按钮宽（须与 .block-button 的 80rpx 同步改），等于 movable-view 物理行程极限，
			// 保证“拖到头”恰为满量程（旋转 360°/进度 100%），与后端百分比坐标系对齐
			captchaProcess.value.end = Math.max(0, Math.round((bgImg.value.width || 0) - uni.upx2px(80)))
		}

		return {
			getCaptcha
		}
	}

	const { getCaptcha } = initCaptchaData()

	/**
	 * 初始化验证码交互
	 */
	const initInteraction = () => {
		// mouse 事件兜底坐标：uni-h5 会给 mouse 事件合成 changedTouches，原生 MouseEvent 直接取自身 pageX/pageY
		const getEventPoint = (e : TouchEvent | MouseEvent) : { pageX : number, pageY : number } => {
			const touch = (e as TouchEvent).changedTouches?.[0]
			return touch ?? (e as MouseEvent)
		}
		// H5 桌面鼠标拖动兜底：uni-h5 movable-view 内部以 mouse 合成驱动位移（滑块跟手）但不派发 touchend，
		// 校验唯一入口 touchend 永不触发（松手无反应且可继续拖）——补 mouse 入口复用同一组 touch handler。
		// H5 触摸结束后浏览器还会补发合成 mousedown/mouseup（ghost mouse），会经 mouse 入口二次触发校验提交，
		// 以最近一次真实 touchend 的时间窗抑制（人手不可能在 500ms 内完成 touch→mouse 切换）
		let lastTouchEndTime = 0
		const isTouchSuppressed = () => Date.now() - lastTouchEndTime < 500
		// 滑块开始
		const touchstart = (e : TouchEvent | MouseEvent) => {
			const point = getEventPoint(e)
			let startX = point.pageX
			let startY = point.pageY
			captchaProcess.value.startX = startX
			captchaProcess.value.startY = startY
			captchaProcess.value.startTime = new Date()

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
		const touchmove = (e : TouchEvent | MouseEvent) => {
			let pageX = Math.round(getEventPoint(e).pageX)
			let pageY = Math.round(getEventPoint(e).pageY)

			const startX = captchaProcess.value.startX || 0
			const startY = captchaProcess.value.startY || 0
			const startTime = captchaProcess.value.startTime
			const end = captchaProcess.value.end
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
			captchaProcess.value.movePercent = moveX / end
		}
		// 滑块结束
		const touchend = (e : TouchEvent | MouseEvent) => {
			if (e.type === 'touchend') {
				lastTouchEndTime = Date.now()
			}
			captchaProcess.value.stopTime = new Date()
			const point = getEventPoint(e)
			let pageX = Math.round(point.pageX)
			let pageY = Math.round(point.pageY)
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
			verifyData()
		}
		// 滑块绑定卡片移动距离
		const startMove = (e : { detail : { x : number } }) => {
			xpos.value = e.detail.x
			nextTick(() => {
				colorWidth.value = xpos.value + uni.upx2px(80)
				leftDistance.value = xpos.value
			})
		}
		// 点选
		const recordClickItem = (e : TouchEvent | PointerEvent) => {
			// left/top 为 0 是合法坐标（点在左上角），仅空值视为未初始化
			if (sliderImg.value.left == null || sliderImg.value.top == null) {
				return
			}

			const point = 'touches' in e ? (e.touches[0] || e.changedTouches[0]) : e
			if (!point) {
				return
			}

			const x = point.pageX
			const y = point.pageY

			const relativeX = sliderImg.value.left - x
			const relativeY = sliderImg.value.top - y

			if (clickCount.value === 0) {
				captchaProcess.value.startTime = new Date()
			}

			clickCount.value++

			if (clickCount.value > 4) {
				return;
			}

			captchaProcess.value.stopTime = new Date()

			const track = {
				x: Math.abs(relativeX),
				y: Math.abs(relativeY),
				type: "click",
				t: new Date().getTime() - captchaProcess.value.startTime.getTime()
			};

			captchaProcess.value.trackArr.push(track)

			if (clickCount.value == 4) {
				verifyData()
			}
		}

		// H5 鼠标入口（模板 @mousedown/@mousemove 绑定；MP/APP 端无 mouse 派发，绑定无效但不报错）
		const mousedown = (e : MouseEvent) => {
			if (isTouchSuppressed()) {
				return
			}
			touchstart(e)
			// #ifdef H5
			// 鼠标松手可能发生在 movable-view 之外（触摸事件有目标捕获、鼠标没有），document 级一次性监听兜底
			document.addEventListener("mouseup", onDocumentMouseup)
			// #endif
		}
		// #ifdef H5
		const onDocumentMouseup = (e : MouseEvent) => {
			document.removeEventListener("mouseup", onDocumentMouseup)
			if (isTouchSuppressed()) {
				return
			}
			touchend(e)
		}
		// #endif
		const mousemove = (e : MouseEvent) => {
			// buttons 位掩码含左键（=1）才转发：悬停滑过不产生轨迹
			if ((e.buttons & 1) === 1 && !isTouchSuppressed()) {
				touchmove(e)
			}
		}

		return {
			touchstart, touchmove, touchend, startMove, recordClickItem, mousedown, mousemove
		}
	}

	const { touchstart, touchmove, touchend, startMove, recordClickItem, mousedown, mousemove } = initInteraction()

	/**
	 * 刷新
	 */
	const refresh = (isClose : boolean) => {
		// 清理成功/失败后的延时任务，防止关闭后旧任务对隐藏组件刷新/关闭
		if (verifyTimer !== undefined) {
			clearTimeout(verifyTimer)
			verifyTimer = undefined
		}
		// 解除游戏区交互阻断
		verifying.value = false
		isActive.value = false
		colorWidth.value = 0
		x.value = xpos.value
		nextTick(() => {
			x.value = 0
			colorWidth.value = uni.upx2px(80)
			isActive.value = true
		})
		verifyResult.value.isError = false
		verifyResult.value.isSuccess = false
		verifyResult.value.errorMsg = undefined
		verifyResult.value.successMsg = undefined
		leftDistance.value = 0
		clickCount.value = 0
		captchaProcess.value.trackArr = []
		// 关闭验证码调用方法不获取新验证码
		// 验证码正在获取中不获取新验证码
		if (!isClose && !captchaLoading.value) {
			getCaptcha()
		}
	}

	// 滑动校验
	const verifyData = async () => {
		// 参数拼接与校验
		const { id, backgroundImageWidth, backgroundImageHeight, startTime, stopTime, trackArr } = captchaProcess.value
		if (!id || !stopTime) {
			return
		}
		// 提交即阻断游戏区交互，直至下次刷新（失败自动刷新/成功展示后关闭均经过 refresh 解除）
		verifying.value = true
		const captchaData : CaptchaRequestData = {
			id: id,
			data: {
				// 旋转类型的进度以拖动满量程（end）为分母，与显示角度同坐标系（对齐官方 TAC 客户端：视觉重合即百分比命中）；
				// 其余类型为绝对像素定位语义，仍以背景宽为分母
				bgImageWidth: captchaProcess.value.type === 'ROTATE' ? captchaProcess.value.end : backgroundImageWidth,
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
				verifyResult.value.successMsg = `验证成功，耗时${(stopTime.getTime() - startTime.getTime()) / 1000}秒`
				verifyTimer = setTimeout(() => {
					verifyTimer = undefined
					close()
					emits('success', resp.data.id)
				}, 1000)
			} else {
				// 校验失败
				verifyResult.value.isError = true
				switch (resp.code) {
					case 4001:
						verifyResult.value.errorMsg = "验证失败，请重新尝试！"
						break
					case 4000:
						verifyResult.value.errorMsg = "验证码被黑洞吸走了！"
						break
					default:
						verifyResult.value.errorMsg = resp.msg
				}
				verifyTimer = setTimeout(() => {
					verifyTimer = undefined
					refresh(false)
				}, 750)
			}
		} catch (err) {
			// 异常刷新
			console.error(err)
			refresh(false)
		}
	}

	// 滑块样式变化
	const imgStyle = computed(() => {
		switch (captchaProcess.value.type) {
			case "ROTATE":
				const angle = leftDistance.value / (captchaProcess.value.end / 360)
				return `transform:translate(100%,0) rotate(${angle}deg);`
			case "SLIDER":
				return `left: ${leftDistance.value}px;`;
			case "CONCAT":
				// 鸿蒙app高度使用rpx * 2
				// #ifdef APP-HARMONY
				return `background-position:${leftDistance.value}px 0;background-image:url(${captchaProcess.value.backgroundImage});background-size: cover;height:${(sliderImg.value.height || 0) * 2}rpx;`
				// #endif
				// #ifndef APP-HARMONY
				return `background-position:${leftDistance.value}px 0;background-image:url(${captchaProcess.value.backgroundImage});background-size: cover;height:${sliderImg.value.height}px;`
				// #endif
			default:
				return ''
		}
	})

	onMounted(() => {
		instanceScope.value = getCurrentInstance() || undefined
	})

	onUnmounted(() => {
		if (verifyTimer !== undefined) {
			clearTimeout(verifyTimer)
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
			height: 610rpx;
			background-color: #ffffff;
			padding: 10rpx 0 20rpx;
			z-index: 999;
			box-shadow: 0 0 10rpx rgba(227, 227, 227, 0.7);
			border-radius: 10px;
			overflow: hidden;

			/* 验证码切换过渡动画 */
			.captcha-loading {
				width: 320rpx;
				height: 24rpx;
				position: fixed;
				border-radius: 16rpx;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: #f0f0f0;
				overflow: hidden;
			}

			/* 闪光条 */
			.captcha-loading::after {
				content: '';
				position: absolute;
				top: 0;
				left: -30%;
				width: 30%;
				height: 100%;
				background: linear-gradient(90deg, rgba(247, 182, 69, 0) 0%, rgba(247, 182, 69, 0.6) 50%, rgba(247, 182, 69, 0) 100%);
				animation: shine 1s infinite;
			}

			@keyframes shine {
				0% {
					left: -30%;
				}

				100% {
					left: 100%;
				}
			}

			.loading-error {
				position: absolute;
				transform: translate(-50%, -50%);
				color: #f56c6c;
				top: 50%;
				left: 50%;
				font-weight: bold;
				text-align: center;
			}

			.slide-in {
				animation: slideIn 300ms ease-in-out forwards;
			}

			.slide-out {
				animation: slideOut 300ms ease-out forwards;
			}

			.slide-hidden {
				visibility: hidden;
				transform: translateX(0);
			}

			@keyframes slideIn {
				from {
					transform: translateX(-100%);
				}

				to {
					transform: translateX(0);
				}
			}

			@keyframes slideOut {
				from {
					transform: translateX(0);
				}

				to {
					transform: translateX(100%);
				}
			}


			.transition {
				transform: translateX(-100%);
				transition: transform 300ms ease;
			}

			.verify-tip {
				font-size: 32rpx;
				font-weight: bold;
				color: #686868;
				padding: 10rpx 10rpx 0 20rpx;
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
					margin-bottom: 20rpx;

					image {
						width: 336rpx;
						height: 64rpx;
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
							margin-right: 20rpx;
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
					/* absolute 脱流：uni-h5/app-vue 的 movable-area 是普通盒（overflow:hidden），流式子元素会把
					   movable-view 挤出 area 可命中区（滑块只剩顶部数像素可点、其余穿透，H5 端拖不动的根因）；
					   小程序/APP 原生端 movable-view 自身绝对定位于 area，不受影响 */
					position: absolute;
					top: 0;
					left: 0;
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
					/* relative 改 absolute：锚定 movable-area 左上角（拖动位移由 transform 承担），
					   恢复滑块整体可命中；小程序端原生 movable-view 定位由组件自管，此声明无副作用 */
					position: absolute;
					top: 0;
					left: 0;
					z-index: 10;

						.arrow {
							font-size: 32rpx;
							color: rgba(255, 255, 255, 0.9)
						}
					}

					&::before {
						content: '';
						position: absolute;
						top: -10rpx;
						left: -10rpx;
						right: -10rpx;
						bottom: -10rpx;
						background-color: #b48d4d;
						border-radius: 100rpx;
						z-index: -1;
					}
				}

				.move-block::after {
					content: "向右滑动完成验证";
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: rgba(0, 0, 0, 0.35);
					font-size: 14px;
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

					.check-msg {
						color: rgba(255, 255, 255, 1)
					}

					&.check-success {
						background: #5ac725;
					}

					&.check-error {
						background: #f56c6c;
					}
				}
			}

			/* 校验期间透明阻断层：盖住拼图与滑块区，不遮底部刷新/关闭 */
			.verify-freeze {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 90rpx;
				z-index: 1001;
			}

			.verify-opts {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin: 0 20rpx;
				position: absolute;
				bottom: 20rpx;
				right: 10rpx;

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

	/** 暗色模式颜色适配（根节点 theme-dark class 由 themeStore.isDark 驱动，系统跟随与 App 内切换均即时生效） */
	.verify-wrap.theme-dark {
		.verify-code {
			background-color: var(--sar-emphasis-bg);
			box-shadow: var(--sar-shadow-sm);

			.captcha-loading {
				background-color: var(--sar-active-bg);
			}

			.captcha-loading::after {
				background: linear-gradient(90deg, rgba(180, 130, 40, 0) 0%, rgba(180, 130, 40, 0.7) 50%, rgba(180, 130, 40, 0) 100%);
			}

			.verify-tip {
				color: var(--sar-secondary-color);
			}

			.loading-error {
				color: #7e2e2f;
			}

			.verify-content {
				background-color: var(--sar-emphasis-bg);

				.move-block {
					background-color: var(--sar-active-bg);

					.move-shadow {
						background-color: rgba(0, 0, 0, 0.05);
						box-shadow: var(--sar-shadow-sm);
					}

					.color-change {
						background-color: #655843;
					}

					.block-button {
						background-color: #9a7a40;

						.arrow {
							color: rgba(255, 255, 255, 0.5)
						}
					}

					&::before {
						background-color: #9a7a40;
					}
				}

				.move-block::after {
					color: rgba(255, 255, 255, 0.35);
				}

				.image-click-mask {
					.click-item {
						background-color: #2a6fc7;
						color: var(--sar-secondary-color);
						border: 4rpx solid var(--sar-secondary-color);
					}
				}

				.check-status {
					.check-msg {
						color: rgba(255, 255, 255, 0.5)
					}

					&.check-success {
						background: #306317;
					}

					&.check-error {
						background: #7e2e2f;
					}
				}
			}
		}
	}
</style>
