/**
 * 兼容垫片：以下类型沿用旧 mescroll-uni 的 API 形状，供调用页面继续 import 使用。
 * RefreshContent 内部为自绘触摸实现、不依赖 mescroll，
 * emit/expose 回传的 MescrollInstance 是组件内部构造的同名 API 对象，方法语义保持兼容：
 *   endSuccess(dataSize, hasNext) / endErr()         —— 请求结束
 *   endByPage / endBySize                            —— 基于页码或总数的等价结束
 *   resetUpScroll / triggerDownScroll / triggerUpScroll / scrollTo / getScrollTop
 * 页面无需改动。
 */
export interface MescrollPageOption {
	num: number
	size: number
	time?: string | number
}

export interface MescrollUpOption {
	use: boolean
	page?: MescrollPageOption
	hasNext?: boolean
	[key: string]: any
}

export interface MescrollDownOption {
	use?: boolean
	auto?: boolean
	[key: string]: any
}

export interface MescrollInstance {
	optDown: MescrollDownOption
	optUp: MescrollUpOption
	num?: number
	size?: number
	endSuccess: (dataSize?: number, hasNext?: boolean, systime?: string | number) => void
	endErr: (errDistance?: number) => void
	endByPage: (dataSize: number, totalPage?: number, systime?: string | number) => void
	endBySize: (dataSize: number, totalSize?: number, systime?: string | number) => void
	resetUpScroll: (isShowLoading?: boolean) => void
	triggerDownScroll: () => void
	triggerUpScroll: (isCheck?: boolean) => void
	scrollTo: (y: number | string, duration?: number) => void
	getScrollTop: () => number
	onPullDownRefresh: () => void
	onPageScroll: (event?: any) => void
	onReachBottom: () => void
}
