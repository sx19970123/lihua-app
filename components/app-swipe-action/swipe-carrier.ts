// 侧滑·载体：按钮组 style 载体的构建（声明期即建，actions 变化时重建）
import type { SwipeAction, SwipeContext } from './swipe-context'

export type SwipeCarrier = {
	// 载体构建（声明期即建）；actions 变化时重建
	syncCarriers : () => void
}

export const createSwipeCarrier = (ctx : SwipeContext) : SwipeCarrier => {
	// 载体构建（声明期即建）；actions 变化时重建
	const syncCarriers = () => {
		ctx.btnStyleL.value = ctx.leftList.value.map((a : SwipeAction) : any => ctx.platform.initBtnStyle(a.color ?? '', -1))
		ctx.btnStyleR.value = ctx.rightList.value.map((a : SwipeAction) : any => ctx.platform.initBtnStyle(a.color ?? '', 1))
		ctx.textStyleL.value = ctx.leftList.value.map((_a : SwipeAction) : any => ctx.platform.initTextStyle())
		ctx.textStyleR.value = ctx.rightList.value.map((_a : SwipeAction) : any => ctx.platform.initTextStyle())
		ctx.contentStyle.value = ctx.platform.initContentStyle()
	}
	return { syncCarriers }
}
