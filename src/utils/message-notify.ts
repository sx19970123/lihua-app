import {measureTextWidth} from '@/utils/text-utils'

/**
 * webSocket 全局消息通知（仅 APP-PLUS，可全局调用无视路由切换）：plus.nativeObj.View 原生绘制层实现。
 * 原生绘制层只有 drawRect/drawText/drawBitmap 三个原语、无 CSS，卡片与投影按以下契约绘制：
 * - 投影用 alpha 阴影床 PNG 模拟：阴影床 424×126，内部挖空透明卡片区 360×68 @ (left 32, top 14)；
 *   View 取原图中段 424-2×sideCrop 宽并适配视口（max 480），shadowScale = viewW/(424-2×sideCrop)，
 *   bitmap 按此比自然缩放（左偏 -sideCrop×scale、两侧外溢被 View 裁剪），实色卡片 drawRect 精确叠在挖空区
 *   （左右各外扩 1 设计稿 px 盖住挖空边缘的抗锯齿暗边），卡片左右留白 = (32-sideCrop)×scale 对称
 *   （sideCrop 设计稿 16px，调边距只改它）；
 *   亮/暗主题各一张（notify-shadow.png / notify-shadow-dark.png），随主题切换换图。
 *   改阴影图几何必须同步 resolveLayout 中的设计稿常量。
 * - 横幅宽度自适应视口并居中；maxWidth（可见卡片宽，缺省 440）仅收窄不撑大——大于视口自适应宽度时自动沿用自适应；
 * - 左侧图标为带 alpha 的 PNG（squircle 外透明）直接 drawBitmap；原生层无圆角裁剪能力，
 *   图标资产必须自带透明轮廓，方形无 alpha 图四角会露底。
 */
type NotifyStyle = {height: number; width: number; top: number; left: number}
type NotifyLayout = {
	noticeContainer: NotifyStyle
	shadowScale: number
	shadowSideCrop: number
	cardRegionW: number
	cardH: number
	cardTopInImg: number
	cardLeftInImg: number
	noticeImage: NotifyStyle
	noticeTitle: NotifyStyle & {size: number}
	noticeContent: NotifyStyle & {size: number}
	maxTop: number
}
type TouchEventData = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  target: EventTarget;
  currentImageIndex?: number;
}
type NotifyContent = {
	title?: string
	content: string
	image?: string
	duration?: number
	// 横幅（可见卡片）最大宽度，px；缺省 440。仅收窄不撑大：大于视口自适应宽度时自动沿用自适应；
	// 未指定时手机即纯自适应，平板等宽屏被缺省 440 截住（整卡等比缩放，纯自适应在宽屏会使高度字号同步膨胀）
	maxWidth?: number
}
const defaultTitle = '通知'
const defaultImage = '_www/static/notice/MessageOutlined.png'
const DEFAULT_DURATION = 3000
// 横幅默认最大宽度（可见卡片宽，非含阴影出血的 View 宽）；440 与 View 上限 480 时等值
const DEFAULT_MAX_WIDTH = 440

type NotifyColor = {
	backageColor: string
	titleColor: string
	contentColor: string
}

class MessageNotify {
	// 通知载体
	private view: PlusNativeObjView | any

	// 通知容器尺寸（含阴影外溢的整体 View）
	private noticeContainer: NotifyStyle | any

	// 阴影底图等比缩放比（原图宽 424 -> 实际 View 宽）
	private shadowScale: number | any

	// 绘制时两侧各裁掉的出血量（设计稿 px 换算，卡片左右留白 = (32-裁量)×scale）
	private shadowSideCrop: number | any

	// 卡片区尺寸（实色背景 drawRect 区域）
	private cardRegionW: number | any
	private cardH: number | any

	// 卡片区在 View 内的偏移（阴影图内部透明卡片区位置）
	private cardTopInImg: number | any
	private cardLeftInImg: number | any

	// 左侧图标尺寸（View 内绝对坐标）
	private noticeImage: NotifyStyle | any

	// 通知标题尺寸
	private noticeTitle: NotifyStyle & {size: number} | any

	// 通知内容尺寸
	private noticeContent: NotifyStyle & {size: number} | any

	// 圆角
	private radius: string | any

	// 通知状态为开启
	private noticeIsShow: boolean | any

	// 通知点击事件
	private clickEvent?: () => void

	// 通知移动事件
	private moveEndEvent?: (direction: 'right' | 'left' | 'bottom' | 'top') => void

	// 自动关闭毫秒数
	private duration:number | any

	// 关闭延迟
	private closeTimeout: any

	// 通知栏滑动状态
	private draggingMeta: {
		// 是否正在滑动
		noticeIsdragging: boolean
		// 开始的y值
		startY: number,
		// 开始的x值
		startX: number,
		// 透明度
		opacity?: number,
		// 滑动方向
		direction?: 'x' | 'y',
		// 向下滑动的最大top值
		maxTop: number,
		// 当前的top值
		currentTop: number
	} | any
	// 操作系统名称
	private osName: string | any

	// 系统主题
	private theme: string | any
	// 颜色
	private color: NotifyColor | any

	// 通知内容
	private notifyContent?: NotifyContent

	constructor() {
		try {
			// 系统信息
			const sysInfo = uni.getSystemInfoSync()

			// 操作系统名称
			this.osName = sysInfo.osName
			// 当前主题
			this.theme = sysInfo.theme || 'light'

			// 圆角
			this.radius = "14px"
			// 通知是否在显示中
			this.noticeIsShow = false
			// 自动关闭毫秒数
			this.duration = DEFAULT_DURATION

			const layout = this.resolveLayout()
			this.applyLayout(layout)

			// 创建原生View对象
			this.view = new (plus as any).nativeObj.View('messageNotify', {
				top: this.noticeContainer.top + 'px',
				left: this.noticeContainer.left + 'px',
				width: this.noticeContainer.width + 'px',
				height: this.noticeContainer.height + 'px'
			});


			// 滑动元数据
			this.draggingMeta = {noticeIsdragging: false, startX: 0, startY: 0, maxTop: layout.maxTop, currentTop: this.noticeContainer.top}

			// 添加点击、滑动事件
			this.addEventListener(() => {
				if (this.clickEvent) {
					// 滑动过程中、startX、startY 为 0 都无法触发点击事件；触发点击事件移动需要先触发touchstart事件
					if (this.draggingMeta.noticeIsdragging || this.draggingMeta.startX === 0 || this.draggingMeta.startY === 0) {
						return
					}
					// 触发业务点击
					this.clickEvent()
				}
				// 关闭通知
				this.hide()
			}, (direction) => {
				// 触发业务滑动
				if (this.moveEndEvent) {
					this.moveEndEvent(direction)
				}
			})

			// 监听主题变化
			this.watchTheme()

			this.color = this.resolveColor()
		} catch(e) {
			console.error("创建消息通知出错，可能是当前系统不兼容原生对象")
			console.error(e)
		}
	}

	/**
	 * 显示弹窗
	 */
	public show = (notifyContent: NotifyContent, clickCallback?: () => void, moveEndCallback?: (direction: 'right' | 'left' | 'bottom' | 'top') => void) => {
		const {title, content, image, duration} = notifyContent
		if (!content) {
			throw new Error("通知内容不存在")
		}
		this.refreshLayout(notifyContent.maxWidth)
		// 赋值消息内容
		this.notifyContent = notifyContent
		// 赋值自动消失时间（每次重置，杜绝上一条的脏值延续）
		if (duration) {
			this.duration = duration
		} else {
			this.duration = DEFAULT_DURATION
		}
		// 赋值事件
		this.clickEvent = clickCallback
		this.moveEndEvent = moveEndCallback

		// 在拖动过程中有新消息，直接重绘
		if (this.draggingMeta.noticeIsdragging) {
			this.view.reset()
			this.drawNotice(title || defaultTitle, content, image || defaultImage)
			return
		}

		const startTop = Math.max(0, this.noticeContainer.top - 16)
		const targetTop = this.noticeContainer.top
		const step = Math.max(1, (targetTop - startTop) / 14)

		// 先关闭已存在的消息再打开
		this.hide().then(() => {
			// 设置动画开始时top值和透明度
			this.view.setStyle({top: startTop + 'px', opacity: 0, left: this.noticeContainer.left + 'px'})
			// 绘制通知
			this.drawNotice(title || defaultTitle, content, image || defaultImage)
			// 显示通知（窗口在屏幕外，并且透明度为0）
			this.view.show()
			this.noticeIsShow = true
			// 执行动画，由上向下滑落，减小透明度
			let top = startTop
			let opacity = 0
			const interval = setInterval(() => {
				// top值判断动画是否结束
				if (top >= targetTop) {
					this.view.setStyle({top: targetTop + 'px', opacity: 1, left: this.noticeContainer.left + 'px'})
					clearInterval(interval)
					this.autoClose()
					return
				}
				// 每帧步进
				top = top + step
				opacity = Math.min(1, opacity + 0.08)
				// 刷新样式
				this.view.setStyle({
					top: top + 'px',
					opacity: opacity
				})
			}, 12)
		})
	}

	/**
	 * 关闭弹窗
	 * 使用定时器渐变消失
	 */
	public hide = () => {
		return new Promise((resolve, _reject) => {
			// 取消自动关闭
			this.cancelAutoClose()
			// 通知为关闭状态直接返回
			if (!this.noticeIsShow) {
				resolve({})
				return
			}
			let opacity = 1
			let interval = setInterval(() => {
				if (opacity <= 0) {
					clearInterval(interval)
					// 销毁并关闭组件
					this.view.reset()
					this.view.hide()
					this.noticeIsShow = false
					this.draggingMeta.noticeIsdragging = false
					resolve({})
					return
				}
				opacity = opacity - 0.12
				this.view.setStyle({
					opacity: opacity
				})
			}, 12)
		})
	}

	// 绘制通知
	private drawNotice = (title: string, content: string, image: string) => {
		const {backageColor, titleColor, contentColor} = this.color
		// 阴影底图（垫底，模拟四周+底部投影），按主题切换亮/暗色图；
		// 两侧各向 View 外偏移 shadowSideCrop 裁掉部分侧出血使卡片贴边（超出 View 的绘制被裁剪）
		const shadowSrc = this.theme === 'dark' ? '_www/static/notice/notify-shadow-dark.png' : '_www/static/notice/notify-shadow.png'
		this.view.drawBitmap(shadowSrc, {}, {top: '0px', left: -this.shadowSideCrop + 'px', width: this.noticeContainer.width + this.shadowSideCrop * 2 + 'px', height: this.noticeContainer.height + 'px'}, 'shadow')
		// 实色卡片背景（叠在阴影图内部透明卡片区）
		this.view.drawRect({color: backageColor, radius: this.radius}, {top: this.cardTopInImg + 'px', left: this.cardLeftInImg + 'px', width: this.cardRegionW + 'px', height: this.cardH + 'px'})
		// 绘制标题
		this.view.drawText(this.textCut(title, this.noticeTitle.size, this.noticeTitle.width), {top: this.noticeTitle.top + 'px', left: this.noticeTitle.left + 'px', width: this.noticeTitle.width + 'px', height: this.noticeTitle.height + 'px'}, {align: 'left', verticalAlign: 'top', size: this.noticeTitle.size + 'px', color: titleColor, weight: 'bold'})
		// 绘制内容
		this.view.drawText(this.textCut(content, this.noticeContent.size, this.noticeContent.width), {top: this.noticeContent.top + 'px', left: this.noticeContent.left + 'px', width: this.noticeContent.width + 'px', height: this.noticeContent.height + 'px'}, {align: 'left', verticalAlign: 'top', color: contentColor, size: this.noticeContent.size + 'px'})
		// 绘制左侧图标（资产须为带 alpha 的 PNG——squircle 外透明，方形无 alpha 图四角会露底且无法圆角）
		this.view.drawBitmap(image, {}, {top: this.noticeImage.top + 'px', left: this.noticeImage.left + 'px', width: this.noticeImage.width + 'px', height: this.noticeImage.height + 'px'})
	}

	// 添加事件
	private addEventListener = (clickCallback: () => void, moveEndCallback: (direction: 'right' | 'left' | 'bottom' | 'top') => void) => {
		this.view.addEventListener("click", clickCallback)
		this.view.addEventListener("touchstart", this.touchStart)

		if (this.osName === 'android') {
			// todo 安卓手机概率性无法触发touchend
			// 等待官方解决，期间进行兼容操作，只允许向上滑动关闭和点击打开
			// 官方解决完成后，该方法直接删除即可
			this.view.addEventListener("touchmove", (event: TouchEventData) => this.androidMove(event, moveEndCallback))
		} else {
			this.view.addEventListener("touchmove", this.touchMove)
		}

		this.view.addEventListener("touchend", (event: TouchEventData) => this.touchEnd(event, moveEndCallback))
	}

	// 开始滑动
	private touchStart = (event: TouchEventData) => {
		this.draggingMeta.startX = event.screenX
		this.draggingMeta.startY = event.screenY
		// 取消自动关闭
		this.cancelAutoClose()
	}

	// 滑动过程中
	private touchMove = (event: TouchEventData) => {
		if (!this.draggingMeta.direction) {
			// 判断滑动方向
			const {screenX, screenY} = event
			const x = Math.abs(this.draggingMeta.startX - screenX)
			const y = Math.abs(this.draggingMeta.startY - screenY)
			this.draggingMeta.direction = x > y ? 'x' : 'y'
			// 修改滑动状态
			this.draggingMeta.noticeIsdragging = true
		}

		// 上下滑动
		if (this.draggingMeta.direction === 'y' && this.draggingMeta.startY !== 0) {
			let targetTop = this.noticeContainer.top + event.screenY - this.draggingMeta.startY
			// 滑动距离（为正数表示向下滑动）
			const specificDirection = event.screenY - this.draggingMeta.startY

			// 下滑，有阻尼
			if (specificDirection > 0) {
				this.draggingMeta.opacity = 1
				// 计算算上阻尼的targetTop
				// 阻尼系数，越高越容易滑动
				const DAMPING = 300;
				const damped = (specificDirection * DAMPING) / (specificDirection + DAMPING)
				targetTop = this.noticeContainer.top + damped;
			} else {
				this.draggingMeta.opacity = 1 - Math.abs(Math.trunc(specificDirection)) * 0.005
			}
			const maxTop = this.draggingMeta.maxTop
			this.draggingMeta.currentTop =  targetTop >= maxTop ? maxTop : targetTop

			this.view.setStyle({
				top: this.draggingMeta.currentTop + 'px',
				opacity: this.draggingMeta.opacity
			})
		}

		// 左右滑动
		if (this.draggingMeta.direction === 'x' && this.draggingMeta.startX !== 0) {
			const targetLeft = this.noticeContainer.left + event.screenX - this.draggingMeta.startX
			const specificDirection = Math.abs(event.screenX - this.draggingMeta.startX)
			const opacity = 1 - Math.trunc(specificDirection) * 0.005
			this.draggingMeta.opacity = opacity
			this.view.setStyle({
				left: targetLeft + 'px',
				opacity: opacity
			})
		}
	}

	private resolveLayout = (maxWidth?: number): NotifyLayout => {
		const windowInfo = uni.getWindowInfo()
		// 横屏时 screenWidth 可能仍是设备竖屏宽度，定位要以当前可视窗口宽度为准。
		const viewportWidth = windowInfo.windowWidth || windowInfo.screenWidth
		const viewportHeight = windowInfo.windowHeight || windowInfo.screenHeight
		// 阴影图左右出血各 32 设计稿 px；View 取原图中间 424-2×sideCrop 一段（两侧各裁 sideCrop 出血，
		// bitmap 向 View 外偏移、超出部分被 View 裁剪），卡片左右留白 = (32 - sideCrop)×scale 保持对称——调边距只改 sideCrop
		const sideCrop = 16
		// 横幅宽度：视口内自适应，宽屏以 maxWidth（可见卡片宽，含外扩 edgeCover 前的设计稿 360 基准）为上限居中
		const maxCardW = maxWidth || DEFAULT_MAX_WIDTH
		// 等比缩放比以 View 宽为准（View 代表原图中段宽 392，bitmap 按此比自然缩放不拉伸）
		const shadowScale = Math.min(viewportWidth / 392, maxCardW / 360)
		// 卡片区尺寸与在阴影图中的偏移（原图：挖空区 360×68，位于 left32/top14）；
		// 卡片矩形左右各外扩 edgeCover 设计稿 px——盖住挖空区边缘的抗锯齿暗边列（alpha≈47），
		// 也消除分数坐标在原生层取整后某一侧露出 1px 暗边的取整敏感性
		const edgeCover = 1
		const cardH = 68 * shadowScale
		const cardTopInImg = 14 * shadowScale
		const cardLeftInImg = (32 - sideCrop - edgeCover) * shadowScale
		const cardRegionW = (360 + edgeCover * 2) * shadowScale
		// View 高 = 整张阴影图等比缩放（原图 424×126）；宽 = 中段设计宽 392×scale（窄屏即视口宽，宽屏被 maxCardW 限止）
		const viewH = 126 * shadowScale
		const viewW = 392 * shadowScale
		const noticeContainer = {
			width: viewW,
			height: viewH,
			top: (windowInfo.statusBarHeight || 0),
			left: Math.max(0, (viewportWidth - viewW) / 2)
		}
		// 图标区（设计稿：卡内边距 8、图标 52×52，随阴影图等比缩放）
		const imageInset = 8 * shadowScale
		const noticeImage = {
			top: cardTopInImg + imageInset,
			left: cardLeftInImg + imageInset,
			width: 52 * shadowScale,
			height: 52 * shadowScale
		}
		// 文本区（图标右侧：内距 8 + 图标 52 + 间距 8 = 68 的设计稿偏移；右侧留 textPadding）
		const textPadding = 16
		const textLeft = cardLeftInImg + 68 * shadowScale
		const textWidth = cardRegionW - 68 * shadowScale - textPadding
		return {
			noticeContainer,
			shadowScale,
			shadowSideCrop: sideCrop * shadowScale,
			cardRegionW,
			cardH,
			cardTopInImg,
			cardLeftInImg,
			noticeImage,
			noticeTitle: {
				top: cardTopInImg + 12,
				left: textLeft,
				width: textWidth,
				height: 20,
				size: 15
			},
			noticeContent: {
				top: cardTopInImg + 38,
				left: textLeft,
				width: textWidth,
				height: 18,
				size: 13
			},
			maxTop: viewportHeight * (1 / 3)
		}
	}

	private applyLayout = (layout: NotifyLayout) => {
		this.noticeContainer = layout.noticeContainer
		this.shadowScale = layout.shadowScale
		this.shadowSideCrop = layout.shadowSideCrop
		this.cardRegionW = layout.cardRegionW
		this.cardH = layout.cardH
		this.cardTopInImg = layout.cardTopInImg
		this.cardLeftInImg = layout.cardLeftInImg
		this.noticeImage = layout.noticeImage
		this.noticeTitle = layout.noticeTitle
		this.noticeContent = layout.noticeContent
		if (this.draggingMeta) {
			this.draggingMeta.maxTop = layout.maxTop
			this.draggingMeta.currentTop = layout.noticeContainer.top
		}
	}

	private refreshLayout = (maxWidth?: number) => {
		this.applyLayout(this.resolveLayout(maxWidth))
		if (!this.view) {
			return
		}
		this.view.setStyle({
			top: this.noticeContainer.top + 'px',
			left: this.noticeContainer.left + 'px',
			width: this.noticeContainer.width + 'px',
			height: this.noticeContainer.height + 'px'
		})
	}

	// 滑动结束
	private touchEnd = (event: TouchEventData, moveEndCallback: (direction: 'right' | 'left' | 'bottom' | 'top') => void) => {
		// 滑动方向
		let direction: 'right' | 'left' | 'bottom' | 'top'
		// 关闭阈值
		let threshold: number = 0
		if (this.draggingMeta.direction === 'x') {
			direction = event.screenX > this.draggingMeta.startX ? 'right' : 'left'
			threshold = 0.4
		} else {
			direction = event.screenY > this.draggingMeta.startY? 'bottom' : 'top'
			direction === 'top' ? threshold = 0.8 : threshold = 0.4
		}
		// 滑动满足阈值后即销毁关闭
		if (this.draggingMeta.opacity && this.draggingMeta.opacity < threshold) {
			this.view.reset()
			this.view.hide()
			if (moveEndCallback) {
				moveEndCallback(direction)
			}
		} else {
			// 否则复原
			this.view.setStyle({top: this.noticeContainer.top + 'px', opacity: 1, left: this.noticeContainer.left + 'px'})
			// 重新开始自动关闭
			this.autoClose()
		}
		// 向下滑动超过maxTop比例则触发回调
		if (direction === 'bottom' && this.draggingMeta.currentTop > this.draggingMeta.maxTop * (3 / 5)) {
			this.view.reset()
			this.view.hide()
			if (moveEndCallback) {
				moveEndCallback(direction)
				// 重新开始自动关闭
				this.autoClose()
			}
		}

		// 延迟20ms，不与点击事件打架
		setTimeout(() => {
			// 重置拖动状态
			this.draggingMeta.noticeIsdragging = false
			this.draggingMeta.startX = 0
			this.draggingMeta.startY = 0
			this.draggingMeta.direction = undefined
		}, 20)
	}

	// 安卓正在滑动
	// todo 安卓手机概率性无法触发touchend
	// 等待官方解决，期间进行兼容操作，只允许向上滑动关闭和点击打开
	// 官方解决完成后，该方法直接删除即可
	private androidMove = (event: TouchEventData, moveEndCallback: (direction: 'right' | 'left' | 'bottom' | 'top') => void) => {
		if (this.draggingMeta.startX === 0 || this.draggingMeta.startY === 0) {
			return
		}

		if (!this.draggingMeta.direction) {
			// 判断滑动方向
			const {screenX, screenY} = event
			const x = Math.abs(this.draggingMeta.startX - screenX)
			const y = Math.abs(this.draggingMeta.startY - screenY)
			this.draggingMeta.direction = x > y ? undefined : 'y'
			if (this.draggingMeta.direction) {
				this.draggingMeta.noticeIsdragging = true
			}
		}

		if (this.draggingMeta.direction === 'y') {
			const specificDirection = event.screenY - this.draggingMeta.startY
			this.draggingMeta.opacity = 1 - Math.abs(Math.trunc(specificDirection)) * 0.005
			// 只能向上滑动
			if (specificDirection <= 0) {
				let targetTop = this.noticeContainer.top + event.screenY - this.draggingMeta.startY
				const maxTop = this.draggingMeta.maxTop
				this.draggingMeta.currentTop =  targetTop >= maxTop ? maxTop : targetTop
				this.view.setStyle({
					top: this.draggingMeta.currentTop + 'px',
					opacity: this.draggingMeta.opacity
				})

				// 向上滑动50像素就执行关闭
				if (specificDirection < - 40) {
					this.androidMoveClose(moveEndCallback);
				}
			}
		}
	}

	// 安卓滑动关闭
	// todo 安卓手机概率性无法触发touchend，
	// 等待官方解决，期间进行兼容操作，只允许向上滑动关闭和点击打开
	// 官方解决完成后，该方法直接删除即可
	private androidMoveClose = (moveEndCallback: (direction: 'right' | 'left' | 'bottom' | 'top') => void) => {
		// 重置拖动状态
		if (!this.draggingMeta.noticeIsdragging) {
			return
		}

		this.view.reset()
		this.view.hide()
		if (moveEndCallback) {
			moveEndCallback('top')
		}

		this.draggingMeta.noticeIsdragging = false
		this.draggingMeta.startX = 0
		this.draggingMeta.startY = 0
		this.draggingMeta.direction = undefined
	}

	// 截取文本
	private textCut = ( text: string, fontSize: number, contentWidth: number ) => {
	  if (!text) return ''

	  const ellipsis = '...'
	  const ellipsisWidth = measureTextWidth(ellipsis, fontSize)
	  contentWidth = contentWidth
	  // 宽度过小
	  if (ellipsisWidth > contentWidth) {
	    return ''
	  }

	  // 原文无需截取
	  if (measureTextWidth(text, fontSize) <= contentWidth) {
	    return text
	  }

	  let left = 0
	  let right = text.length
	  let result = ''

	  while (left <= right) {
	    const mid = Math.floor((left + right) / 2)
	    const slice = text.slice(0, mid)
	    const width = measureTextWidth(slice, fontSize) + ellipsisWidth

	    if (width <= contentWidth) {
	      result = slice
	      left = mid + 1
	    } else {
	      right = mid - 1
	    }
	  }

	  return result + ellipsis
	}

	// 自动关闭
	private autoClose = () => {
		// 先取消再添加
		this.cancelAutoClose()
		this.closeTimeout = setTimeout(() => {
			this.hide()
			clearTimeout(this.closeTimeout)
		}, this.duration)
	}

	// 取消自动关闭
	private cancelAutoClose = () => {
		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout)
			this.closeTimeout = undefined
		}
	}

	// 监听主题变化
	private watchTheme = () => {
		uni.onThemeChange((resp) => {
			// 监听到的主题可能为auto，auto 则调用系统信息接口获取主题
			const theme = resp.theme as 'light' | 'dark' | 'auto'
			if (theme === 'auto') {
				this.theme = uni.getSystemInfoSync().theme || 'light'
			} else {
				this.theme = theme
			}

			this.color = this.resolveColor()

			// 通知正在开启时变换主题，重新绘制
			if (this.noticeIsShow && this.notifyContent) {
				const {title, content, image} = this.notifyContent
				this.view.reset()
				this.drawNotice(title || defaultTitle, content, image || defaultImage)
			}
		});
	}

	private resolveColor = (): NotifyColor => {
		if (this.theme === 'light') {
			return {
				backageColor: '#f7f7f7',
				titleColor: 'rgba(0,0,0,0.88)',
				contentColor: 'rgba(0,0,0,0.52)'
			}
		}
		return {
			backageColor: '#242426',
			titleColor: 'rgba(255,255,255,0.92)',
			contentColor: 'rgba(255,255,255,0.56)'
		}
	}

}

export default new MessageNotify()
