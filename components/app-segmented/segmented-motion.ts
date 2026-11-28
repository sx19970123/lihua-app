// 分段器·运动：滑块视觉位置、落位弹簧与提交选中
import type { SegmentedContext } from './segmented-context'

export type SegmentedMotion = {
	// 当前视觉位置（手势抢断/弹簧起点取值用）
	visualX : () => number
	// 提交选中：弹簧滑到位 + 对外回传（值未变不 emit）
	commit : (idx : number, velPxPerS ?: number) => void
}

export const createSegmentedMotion = (ctx : SegmentedContext) : SegmentedMotion => {
	// 当前视觉位置（手势抢断/弹簧起点取值用）
	const visualX = () : number => ctx.dragX.value != null ? ctx.dragX.value : (ctx.animX.value != null ? ctx.animX.value : ctx.index.value * ctx.segW.value)

	const springDone = () : void => { ctx.animX.value = null }

	// 提交选中：弹簧滑到位 + 对外回传（值未变不 emit）
	const commit = (idx : number, velPxPerS : number = 0) => {
		ctx.springCtl.cancel()
		const from = visualX()
		const to = idx * ctx.segW.value
		ctx.index.value = idx
		ctx.dragX.value = null
		if (ctx.segW.value > 0 && Math.abs(to - from) >= 0.5) {
			ctx.animX.value = from
			ctx.springCtl.run(from, to, velPxPerS, (x : number) => { ctx.animX.value = x }, springDone)
		} else {
			ctx.animX.value = null
		}
		const v = ctx.selection.valueAt(idx)
		if (v !== '' && v !== (ctx.props.modelValue ?? '')) {
			ctx.emit('update:modelValue', v)
			ctx.emit('change', v)
		}
	}
	return { visualX, commit }
}
