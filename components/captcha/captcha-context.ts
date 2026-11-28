// 验证码各职责模块共用的上下文：属性与事件、响应式状态、布局常量，以及跨模块读写的普通状态。
// 模块之间不互相引用，一律经 ctx 读写；platform / card / measure / drag / flow 五个模块在入口组装时挂上来
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { CaptchaResponseData } from '@/api/system/captcha/type/captcha-type'
import type { CaptchaCard } from './captcha-card'
import type { CaptchaDrag } from './captcha-drag'
import type { CaptchaFlow } from './captcha-flow'
import type { CaptchaMeasure } from './captcha-measure'
import type { CaptchaPlatform } from './captcha-platform'

export type CaptchaProps = {
	themeLight?: string
	themeDark?: string
}

export type CaptchaEmit = {
	(e : 'success', id : string) : void
}

export type TrackItem = { x : number, y : number, type : string, t : number }

// 刷新切换相位
export type SlidePhase = 'idle' | 'out' | 'waiting' | 'in'

export type CaptchaContext = {
	props : CaptchaProps
	emit : CaptchaEmit
	// ---- 常量 ----
	// 布局常量（提交后端的轨迹坐标系同源）：卡片 320、内容 288、图区高 180、轨道/滑块钮 40
	CARD_PADDING : number
	CARD_WIDTH : number
	CONTENT_WIDTH : number
	IMAGE_HEIGHT : number
	THUMB_SIZE : number
	DRAG_END : number
	// 轨道占位文案：POW 与图形类共用
	TRACK_PLACEHOLDER : string
	// ---- 响应式状态 ----
	// 浮层是否显示
	visible : Ref<boolean>
	// 内容容器（pow/graphic 二选一存在）：滑切位移 setProperty 直驱用
	contentEl : Ref<any>
	// 进场态：初始即起点，class 切换过渡
	entered : Ref<boolean>
	// POW↔图形高度动画 class（a/b 交替，见 getCaptcha），并入 sizeClass 输出
	heightAnim : Ref<string>
	// 高度动画 class 的交替位：每次跨高取反，强制 class 值变化以重播动画
	heightFlip : Ref<boolean>
	// 刷新切换相位：out=旧内容右滑出，waiting=滑出完成等响应（loading 唯一显示窗），
	// in=新容器（:key 重建）首帧停左侧待滑入
	slidePhase : Ref<SlidePhase>
	// 滑入动画放行标志：容器渲染稳定后再挂动画 class
	contentAnim : Ref<boolean>
	// 按钮扣住标志：滑切/打开全程扣住，滑入动画播完（sleep 300 后）放行——按钮与滑入完成同步现身
	optsHold : Ref<boolean>
	// 取码中：卡片出全屏加载态
	captchaLoading : Ref<boolean>
	// 错误态文案（取码失败、验证码配置缺失）；undefined=没有错误
	loadingError : Ref<string | undefined>
	// 题型；取码前为 undefined
	type : Ref<CaptchaResponseData['type'] | undefined>
	// 当前验证码 id（换码即重建内容容器）
	captchaId : Ref<string>
	// 背景图地址
	backgroundImage : Ref<string>
	// 图块小图地址（点选题作提示图）
	sliderImage : Ref<string>
	// POW 挖矿参数 [difficulty, saltLen, num]；非 POW 题型为 undefined
	powParam : Ref<number[] | undefined>
	// CONCAT 拼接窗口高（px）
	concatHeight : Ref<number>
	// 图块渲染宽（高恒 180，宽按原图比例计算）
	pieceWidth : Ref<number>
	// 本次交互的起始时刻（Date.now 毫秒）
	startTime : Ref<number>
	// 本次交互的结束时刻（Date.now 毫秒）
	stopTime : Ref<number>
	// 操作轨迹：拖动记 down/move/up，点选记 click
	trackArr : Ref<TrackItem[]>
	// 点选已点次数
	clickCount : Ref<number>
	// 图形题拖动位移（px）
	dragX : Ref<number>
	// POW 轨道拖动位移（px）
	powX : Ref<number>
	// 正在拖动
	dragging : Ref<boolean>
	// POW 相位：slide=待滑，mining=挖矿中，success/fail=结果期
	powPhase : Ref<'slide' | 'mining' | 'success' | 'fail'>
	// POW 失败文案
	powFailMsg : Ref<string>
	// 挖矿进度（onProgress 百分比）与超时显示标志：>1s 才在「正在验证...」后追加括号进度
	powProgress : Ref<number>
	// 挖矿超时显示标志：挖矿超 1s 才显示进度括号
	powShowProgress : Ref<boolean>
	// POW 成功文案
	powSuccessMsg : Ref<string>
	// 图形题结果期：彩带/横条显示中
	showResult : Ref<boolean>
	// 图形题结果成败
	resultOk : Ref<boolean>
	// 图形题结果文案
	resultMsg : Ref<string>
	// 校验中：轨道文案换成「正在验证」、滑块出转圈并挂透明阻断层
	verifying : Ref<boolean>
	// POW 轨道滑块元素
	powUnitEl : Ref<UniElement | null>
	// POW 轨道色带元素（文案下层）
	powFillEl : Ref<UniElement | null>
	// 图形题轨道滑块元素
	dragUnitEl : Ref<UniElement | null>
	// 图形题轨道色带元素（文案下层）
	dragFillEl : Ref<UniElement | null>
	// 图块元素（拼接条 / 旋转图 / 滑块图）
	sliderEl : Ref<UniElement | null>
	// 卡片尺寸类：加载/错误、POW、图形各一档，并入进场态与高度动画 class
	sizeClass : ComputedRef<string>
	// 右上操作区是否显示：不在加载/错误、不在滑切、未被扣住
	optsVisible : ComputedRef<boolean>
	// POW 轨道文案：待滑/挖矿（超 1s 追加括号进度）/结果（文案已由彩带层接管，此层不显示）
	powTrackText : ComputedRef<string>
	// ---- 跨模块读写的普通状态：只能经 ctx.xxx 读写，不能解构出来 ----
	// 点选蒙层位置（轨迹换算基准），量测时改属性
	maskRect : { left : number, top : number }
	// 校验结果倒计时 / 挖矿进度显示定时器；undefined=没有。stopJobs 统一清理
	verifyTimer : ReturnType<typeof setTimeout> | undefined
	// 挖矿取消句柄；undefined=没有。stopJobs 统一清理
	cancelPowMining : (() => void) | undefined
	// 所属页面实例：挂载期缓存，点选题量测取蒙层元素用
	ownerPage : any
	// 微信端：挂载期缓存的组件实例，量测用
	ownerInstance : any
	// ---- 组装时挂上的模块 ----
	platform : CaptchaPlatform
	card : CaptchaCard
	measure : CaptchaMeasure
	drag : CaptchaDrag
	flow : CaptchaFlow
}

export const createCaptchaContext = (props : CaptchaProps, emit : CaptchaEmit) : CaptchaContext => {
	// 布局常量（提交后端的轨迹坐标系同源）：卡片 320、内容 288、图区高 180、轨道/滑块钮 40
	const CARD_PADDING = 16
	const CARD_WIDTH = 320
	const CONTENT_WIDTH = CARD_WIDTH - CARD_PADDING * 2
	const IMAGE_HEIGHT = 180
	const THUMB_SIZE = 40
	const DRAG_END = CONTENT_WIDTH - THUMB_SIZE
	// 轨道占位文案：POW 与图形类共用
	const TRACK_PLACEHOLDER = '向右拖动完成验证'

	const visible = ref<boolean>(false)
	// 内容容器（pow/graphic 二选一存在）：滑切位移 setProperty 直驱用
	const contentEl = ref<any>(null)
	// 进场态：初始即起点，class 切换过渡
	const entered = ref<boolean>(false)
	// POW↔图形高度动画 class（a/b 交替，见 getCaptcha），并入 sizeClass 输出
	const heightAnim = ref<string>('')
	const heightFlip = ref<boolean>(false)
	// 刷新切换相位：out=旧内容右滑出，waiting=滑出完成等响应（loading 唯一显示窗），
	// in=新容器（:key 重建）首帧停左侧待滑入
	const slidePhase = ref<'idle' | 'out' | 'waiting' | 'in'>('idle')
	// 滑入动画放行标志：容器渲染稳定后再挂动画 class
	const contentAnim = ref<boolean>(false)
	// 按钮扣住标志：滑切/打开全程扣住，滑入动画播完（sleep 300 后）放行——按钮与滑入完成同步现身
	const optsHold = ref<boolean>(false)
	const captchaLoading = ref<boolean>(false)
	const loadingError = ref<string>()
	const type = ref<CaptchaResponseData['type']>()
	const captchaId = ref<string>('')
	const backgroundImage = ref<string>('')
	const sliderImage = ref<string>('')
	const powParam = ref<number[]>()
	const concatHeight = ref<number>(0)
	// 图块渲染宽（高恒 180，宽按原图比例计算）
	const pieceWidth = ref<number>(0)

	const startTime = ref<number>(0)
	const stopTime = ref<number>(0)
	const trackArr = ref<TrackItem[]>([])
	const clickCount = ref<number>(0)

	const dragX = ref<number>(0)
	const powX = ref<number>(0)
	const dragging = ref<boolean>(false)
	const powPhase = ref<'slide' | 'mining' | 'success' | 'fail'>('slide')
	const powFailMsg = ref<string>('验证失败，请重试')
	// 挖矿进度（onProgress 百分比）与超时显示标志：>1s 才在「正在验证...」后追加括号进度
	const powProgress = ref<number>(0)
	const powShowProgress = ref<boolean>(false)
	const powSuccessMsg = ref<string>('验证成功')

	const showResult = ref<boolean>(false)
	const resultOk = ref<boolean>(false)
	const resultMsg = ref<string>('')
	const verifying = ref<boolean>(false)

	const powUnitEl = ref<UniElement | null>(null)
	const powFillEl = ref<UniElement | null>(null)
	const dragUnitEl = ref<UniElement | null>(null)
	const dragFillEl = ref<UniElement | null>(null)
	const sliderEl = ref<UniElement | null>(null)

	const sizeClass = computed(() : string => {
		let cls = ''
		if (captchaLoading.value || loadingError.value) {
			cls = 'lh-cap-card--loading'
		} else {
			cls = type.value === 'POW' ? 'lh-cap-card--pow' : 'lh-cap-card--graphic'
		}
		if (entered.value) {
			cls += ' lh-cap-card--in'
		}
		if (heightAnim.value) {
			cls += ' ' + heightAnim.value
		}
		return cls
	})

	// 错误态也常显：刷新即重试、关闭同平时
	const optsVisible = computed(() : boolean => !!loadingError.value || (!captchaLoading.value && slidePhase.value === 'idle' && !optsHold.value))

	// POW 轨道文案：待滑（占位与图形类统一）/挖矿（超 1s 追加括号进度）/结果（文案已由彩带层接管，此层不显示）
	const powTrackText = computed(() : string => {
		if (powPhase.value === 'slide') {
			return TRACK_PLACEHOLDER
		}
		if (powPhase.value === 'mining' && powShowProgress.value) {
			return `正在验证...（${powProgress.value}%）`
		}
		return '正在验证...'
	})

	return {
		props,
		emit,
		CARD_PADDING,
		CARD_WIDTH,
		CONTENT_WIDTH,
		IMAGE_HEIGHT,
		THUMB_SIZE,
		DRAG_END,
		TRACK_PLACEHOLDER,
		visible,
		contentEl,
		entered,
		heightAnim,
		heightFlip,
		slidePhase,
		contentAnim,
		optsHold,
		captchaLoading,
		loadingError,
		type,
		captchaId,
		backgroundImage,
		sliderImage,
		powParam,
		concatHeight,
		pieceWidth,
		startTime,
		stopTime,
		trackArr,
		clickCount,
		dragX,
		powX,
		dragging,
		powPhase,
		powFailMsg,
		powProgress,
		powShowProgress,
		powSuccessMsg,
		showResult,
		resultOk,
		resultMsg,
		verifying,
		powUnitEl,
		powFillEl,
		dragUnitEl,
		dragFillEl,
		sliderEl,
		sizeClass,
		optsVisible,
		powTrackText,
		maskRect : { left : 0, top : 0 },
		verifyTimer : undefined,
		cancelPowMining : undefined,
		// 所属页面实例：挂载期缓存，点选题量测取蒙层元素用
		ownerPage : null,
		// 微信端：挂载期缓存的组件实例，量测用
		ownerInstance : undefined as any,
		platform : null as any as CaptchaPlatform,
		card : null as any as CaptchaCard,
		measure : null as any as CaptchaMeasure,
		drag : null as any as CaptchaDrag,
		flow : null as any as CaptchaFlow
	}
}
