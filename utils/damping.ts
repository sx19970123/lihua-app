// 越界阻尼：手指越过边界后的位移如何折成视觉位移。消费方：app-swipe-action 橡皮筋段 / app-segmented 到头拖动 / app-sheet 露头模式到头拖动

// 线性阻尼：视觉越界 = 越界量 × factor（factor 0~1，越小越硬）
export const damp = (over : number, factor : number) : number => over * factor

// 橡皮筋（分式衰减）：视觉越界随手指越界量 raw 渐近 limit、永不触顶；stiff 越大起始越跟手（常用 0.4）。
// 越界量为 0 或上限非正时视为没有越界
export const rubber = (raw : number, limit : number, stiff : number = 0.4) : number => {
	if (raw <= 0 || limit <= 0) {
		return 0
	}
	const k = raw * stiff
	return limit * k / (limit + k)
}
