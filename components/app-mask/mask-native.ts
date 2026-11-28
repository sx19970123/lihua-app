// 遮罩·原生层：条带的挂与摘、点到条带的回调
import { showMask, hideMask } from '@/uni_modules/lihua-mask'
import { STD_MASK_ALPHA } from '@/utils/tokens-std'
import type { MaskContext } from './mask-context'

export type MaskNative = {
	// 挂原生层
	attachNative : () => void
	// 摘原生层
	detachNative : () => void
}

export const createMaskNative = (ctx : MaskContext) : MaskNative => {
	const onMaskTap = () => {
		ctx.emit('click')
	}

	// 挂原生层：两层接缝取同一时刻的避让距离（页面内层底边=底部条带顶）
	const attachNative = () => {
		ctx.platform.syncBottom()
		ctx.platform.lockSwipeBack()
		showMask(ctx.platform.buildStrips(), ctx.progress * STD_MASK_ALPHA, onMaskTap)
	}

	// 摘原生层：宿主页恢复可侧滑返回
	const detachNative = () => {
		hideMask()
		ctx.platform.unlockSwipeBack()
	}

	return { attachNative, detachNative }
}
