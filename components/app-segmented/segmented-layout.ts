// 分段器·量测：段宽（组实宽/段数）与内容宽模式下各段的自然宽
import { nextTick } from 'vue'
import type { SegmentedContext } from './segmented-context'

export type SegmentedLayout = {
	// 段宽=组实宽/段数（拖动开始时重量测）；Async 版跨端通吃（MP 端无同步 getBoundingClientRect）
	measure : () => void
	// 内容宽模式：量各段自然宽，取最宽者为统一段宽
	fitCells : () => void
}

export const createSegmentedLayout = (ctx : SegmentedContext) : SegmentedLayout => {
	// 段宽=组实宽/段数（拖动开始时重量测）；Async 版跨端通吃（MP 端无同步 getBoundingClientRect）
	const measure = () : void => {
		ctx.groupEl.value?.getBoundingClientRectAsync().then((r : any) => {
			const n = ctx.items.value.length
			if (r != null && r.width > 0 && n > 0) {
				ctx.segW.value = r.width / n
				ctx.groupLeft = r.left
			}
		})
	}

	// 内容宽模式：量各段自然宽，取最宽者为统一段宽
	const fitCells = () : void => {
		ctx.cellW.value = 0
		nextTick(() => {
			uni.createSelectorQuery().in(ctx.owner)?.selectAll('.app-segmented-item')?.boundingClientRect()?.exec((ret : any) => {
				const rects = ret[0] as Array<{ width : number }> | null
				if (rects == null || rects.length == 0) {
					return
				}
				let w = 0
				for (let i = 0; i < rects.length; i++) {
					if (rects[i].width > w) {
						w = rects[i].width
					}
				}
				ctx.cellW.value = Math.ceil(w)
				nextTick(() => { measure() })
			})
		})
	}
	return { measure, fitCells }
}
