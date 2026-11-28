// 分段器·点按：段位按压高亮与点选切换
import type { SegmentedContext } from './segmented-context'

export type SegmentedTap = {
	// 段位按下：显示按压影子
	onItemTouchStart : (i : number) => void
	// 段位点击：切换选中
	onItemTap : (i : number) => void
}

export const createSegmentedTap = (ctx : SegmentedContext) : SegmentedTap => {
	const onItemTouchStart = (i : number) => {
		const arr = ctx.items.value
		ctx.pressIdx.value = (ctx.props.hover && !ctx.isDisabledAll.value && i >= 0 && i < arr.length && !arr[i].disabled) ? i : -1
	}

	const onItemTap = (i : number) => {
		if (ctx.isDisabledAll.value || i === ctx.index.value) {
			return
		}
		const arr = ctx.items.value
		if (i < 0 || i >= arr.length || arr[i].disabled) {
			return
		}
		ctx.motion.commit(i)
	}
	return { onItemTouchStart, onItemTap }
}
