type NotifyStyle = {height: number; width: number; top: number; left: number}

class MessageNotify {
	// 通知载体
	private view: PlusNativeObjView
	
	// 通知容器尺寸
	private noticeContainer: NotifyStyle
	
	// 通知图片尺寸
	private noticeImage: NotifyStyle
	
	// 通知标题尺寸
	private noticeTitle: NotifyStyle & {color: string, size: string}
	
	// 通知内容尺寸
	private noticeContent: NotifyStyle & {color: string, size: string}
	
	// 背景颜色
	private backageColor: string
	
	// 圆角
	private radius: string
	
	// 通知状态为开启
	private noticeIsShow: boolean
	
	constructor() {
		// 初始化容器尺寸
		const windowInfo = uni.getWindowInfo()
		// 容器最大宽度，480 以下的设备都以边距16进行计算
		const maxWidth = 480
		// 边距
		const margin = 8
		// 高度
		const height = 72
		
		// 容器全部宽度
		const width = windowInfo.screenWidth > maxWidth ? maxWidth : windowInfo.screenWidth
		// 左位置
		const left = width === maxWidth ? (windowInfo.screenWidth - width) / 2 : margin
		// 背景颜色
		this.backageColor = "#fff"
		// 圆角
		this.radius = "16px"
		
		this.noticeIsShow = false
		
		// 容器尺寸
		this.noticeContainer = {
			width: width - left * 2,
			height: height,
			top: windowInfo.statusBarHeight,
			left: left
		}
		
		// 图片尺寸
		this.noticeImage = {
			top: margin,
			left: margin,
			width: height - margin * 2,
			height: height - margin * 2
		}
		
		// 标题尺寸
		this.noticeTitle = {
			top: margin * 1.5,
			left: this.noticeImage.width + margin * 2,
			width: width - (this.noticeImage.width + margin * 2 + margin),
			height: height / 2,
			color: "#000",
			size: '17px'
		}
		
		// 内容尺寸
		this.noticeContent = {
			top: height / 2 + margin / 2,
			left: this.noticeImage.width + margin * 2,
			width: width - (this.noticeImage.width + margin * 2 + margin),
			height: height / 2,
			color: 'rgba(0, 0, 0, 0.45)',
			size: '16px'
		}
		
		// 创建原生View对象
		this.view = new (plus as any).nativeObj.View('messageNotify', {
			top: this.noticeContainer.top + 'px',
			left: this.noticeContainer.left + 'px',
			width: this.noticeContainer.width + 'px',
			height: this.noticeContainer.height + 'px'
		});
	}
	
	/**
	 * 显示弹窗
	 */
	public show = (title: string = "收到一条新通知", content: string = "通知通知通知通知通知通知通知", image: string = "_www/static/logo.png") => {
		this.hide().then(() => {
			// 绘制通知
			this.drawNotice(title, content, image)
			// 显示通知（窗口在屏幕外，并且透明度为0）
			this.view.show()
			this.noticeIsShow = true
			// 执行动画，由上向下滑落，减小透明度
			let top = 0
			let opacity = 0
			const interval = setInterval(() => {
				// top值判断动画是否结束
				if (top >= this.noticeContainer.top) {
					clearInterval(interval)
					return
				}
				// 每帧步进
				top = top + 12
				opacity = opacity + 0.2
				// 刷新样式
				this.view.setStyle({
					top: top + 'px',
					opacity: opacity
				})
			}, 16)
		})
	}
	
	/**
	 * 关闭弹窗
	 * 使用定时器渐变消失
	 */
	public hide = () => {
		return new Promise((resolve, reject) => {
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
					resolve({})
					return
				}
				opacity = opacity - 0.2
				this.view.setStyle({
					opacity: opacity
				})
			}, 16)
		})
	}
	
	// 绘制通知
	private drawNotice(title: string, content: string, image: string) {
		// 设置动画开始时top值和透明度
		this.view.setStyle({top: '0px', opacity: 0})
		// 绘制通知最外层content
		this.view.drawRect({color: this.backageColor, radius: this.radius})
		// 绘制标题
		this.view.drawText(title, {top: this.noticeTitle.top + 'px', left: this.noticeTitle.left + 'px', width: this.noticeTitle.width + 'px', height: this.noticeTitle.height + 'px'}, {align: 'left', verticalAlign: 'top', size: this.noticeTitle.size, color: this.noticeTitle.color})
		// 绘制内容
		this.view.drawText(content, {top: this.noticeContent.top + 'px', left: this.noticeContent.left + 'px', width: this.noticeContent.width + 'px', height: this.noticeContent.height + 'px'}, {align: 'left', verticalAlign: 'top', color: this.noticeContent.color, size: this.noticeContent.size})
		// 绘制左侧图片
		this.view.drawBitmap(image, {}, {top: this.noticeImage.top + 'px', left: this.noticeImage.left + 'px', width: this.noticeImage.width + 'px', height: this.noticeImage.height + 'px'})
		// 绘制图片遮罩，呈现圆角
		this.view.drawRect({color: 'rgba(0,0,0,0)', borderWidth:'8px',radius: this.radius, borderColor: this.backageColor}, {height: this.noticeContainer.height + 'px', width: this.noticeImage.width + this.noticeImage.left * 2 + 'px'}, 'mask')
	}

}

export default new MessageNotify()
