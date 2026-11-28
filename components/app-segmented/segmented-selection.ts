// 分段器·选中映射：段序号与选中值互查
import type { SegmentedContext } from './segmented-context'

export type SegmentedSelection = {
	// 段序号对应的值；越界为空串
	valueAt : (i : number) => string
	// 值对应的段序号；没有为 -1
	indexOfValue : (v : string) => number
}

export const createSegmentedSelection = (ctx : SegmentedContext) : SegmentedSelection => {
	const valueAt = (i : number) : string => {
		const arr = ctx.items.value
		return i >= 0 && i < arr.length ? arr[i].value : ''
	}

	const indexOfValue = (v : string) : number => {
		const arr = ctx.items.value
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].value === v) {
				return i
			}
		}
		return -1
	}
	return { valueAt, indexOfValue }
}
