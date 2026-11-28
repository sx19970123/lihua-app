// 侧滑·侧实体：一侧彩带的几何量测与宽度/位移驱动写层
import { SIDE_L, SIDE_R } from './swipe-platform'
import type { SwipeContext } from './swipe-context'

// 侧几何（量测）：Wi'=叠塔宽（自身+右侧全部）、W=组宽；margins=各彩带文字左边距
export type SwipeSideGeom = { fan : number[], margins : number[], total : number }

// 侧实体：主状态机按侧持有的实例，createSwipeSides 建左右两个
export type SwipeSide = {
	// 侧几何（量测）：叠塔宽、文字左边距、组宽
	g : SwipeSideGeom
	// 符号：-1=左组（藏左外）/ 1=右组（藏右外）
	fixedSign : number
	// 彩带驱动：p∈[0,1] 线性跟手；p>1 弹簧平分阻尼
	driveAt : (p : number) => void
	// 宽度/文字位瞬回静态常量
	resetStatic : () => void
	// 量测+静态锁定（可重入，actions 变化时重量测；量测经适配器：app 真量测，MP 估算）
	measure : (labels : string[]) => void
	// 该侧进过弹簧段（回程须复位宽度）
	isSpringDirty : () => boolean
	clearSpringDirty : () => void
	// 写层：经平台适配器（app/鸿蒙/H5=元素 setProperty，MP=style 载体）
	wBtn : (i : number, prop : string, val : string) => void
	wText : (i : number, prop : string, val : string) => void
}

export const createSwipeSides = (ctx : SwipeContext) : SwipeSide[] => {
	// 侧实体：封装一侧的几何与驱动方法，主状态机按侧调用
	const makeSide = (fixedSign : number) : SwipeSide => {
		const g : SwipeSideGeom = { fan: [], margins: [], total: 0 }
		// 该侧进过弹簧段才需在回程复位宽度
		let springDirty = false
		// 侧标识（适配器寻址）
		const side = fixedSign < 0 ? SIDE_L : SIDE_R

		// 写层：经平台适配器（app/鸿蒙/H5=元素 setProperty，MP=style 载体）
		const wBtn = (i : number, prop : string, val : string) => {
			ctx.platform.btn(side, i, prop, val)
		}
		const wText = (i : number, prop : string, val : string) => {
			ctx.platform.text(side, i, prop, val)
		}

		// 彩带驱动：p∈[0,1] 线性跟手；p>1 弹簧平分阻尼
		const driveAt = (p : number) => {
			const n = g.fan.length
			for (let i = 0; i < n; i++) {
				let d = 0
				if (p > 1) {
					const over = (p - 1) * g.total
					const add = over * (n - i) / n
					wBtn(i, 'width', `${g.fan[i] + add}px`)
					if (fixedSign < 0) {
						// 左组橡皮筋：右缘延展，文字须随右缘同步右移
						wText(i, 'margin-left', `${(g.margins[i] ?? 0) + add}px`)
					}
					springDirty = true
				} else {
					d = g.fan[i] * (1 - p)
					if (springDirty) {
						wBtn(i, 'width', `${g.fan[i]}px`)
						if (fixedSign < 0) {
							wText(i, 'margin-left', `${g.margins[i] ?? 0}px`)
						}
					}
				}
				wBtn(i, 'transform', `translateX(${fixedSign * d}px)`)
			}
			if (p <= 1) {
				springDirty = false
			}
		}

		// 宽度/文字位瞬回静态常量
		const resetStatic = () => {
			for (let i = 0; i < g.fan.length; i++) {
				wBtn(i, 'width', `${g.fan[i]}px`)
				wText(i, 'margin-left', `${g.margins[i] ?? 0}px`)
			}
		}

		// 量测+静态锁定（可重入，actions 变化时重量测；量测经适配器：app 真量测，MP 估算）
		const measure = (labels : string[]) => {
			g.fan.splice(0, g.fan.length)
			g.margins.splice(0, g.margins.length)
			g.total = 0
			const widths : number[] = []
			const textWidths : number[] = []
			let acc = 0
			for (let i = 0; i < labels.length; i++) {
				const tw = ctx.platform.textWidth(side, i, labels[i] ?? '')
				textWidths.push(tw)
				// 彩带宽向上取整为整数像素：收起藏外时被绘制边与裁切边重合
				const w = Math.ceil(tw) + 32
				widths.push(w)
				acc += w
			}
			g.total = acc
			// 叠塔宽 fan[i]=wi+Σ(j>i)（左组已反转渲染序，同公式成立）
			for (let i = 0; i < widths.length; i++) {
				let sum = widths[i]
				for (let j = i + 1; j < widths.length; j++) {
					sum += widths[j]
				}
				g.fan.push(sum)
			}
			for (let i = 0; i < widths.length; i++) {
				wBtn(i, 'width', `${g.fan[i]}px`)
				// 文字钉位=自身可见段中心（左组可见段起点=上层总宽，须镜像偏移）
				let ml : number
				if (fixedSign > 0) {
					ml = Math.max(0, (widths[i] - textWidths[i]) / 2)
				} else {
					let above = 0
					for (let j = i + 1; j < widths.length; j++) {
						above += widths[j]
					}
					ml = above + Math.max(0, (widths[i] - textWidths[i]) / 2)
				}
				g.margins.push(ml)
				wText(i, 'margin-left', `${ml}px`)
			}
		}

		const isSpringDirty = () : boolean => springDirty
		const clearSpringDirty = () => { springDirty = false }

		return { g, fixedSign, driveAt, resetStatic, measure, isSpringDirty, clearSpringDirty, wBtn, wText }
	}
	// 双实例：左实体 fixedSign=-1（藏左外）/右实体 +1（藏右外）
	return [makeSide(-1), makeSide(1)]
}
