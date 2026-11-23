// 物理弹簧引擎（欠阻尼积分）：16ms setTimeout 链+代际 token（cancel 后已入队帧不执行）
// 默认 k=170/c=18、收敛阈值 0.5/30（px 域）；可选参覆盖——进度域（0→1）调用须收紧阈值
// 初速 v0 承接松手末速度；消费方：app-segmented 滑块 / app-swipe-action 惯性收起+确认链
export const createSpringControl = (k ?: number, c ?: number, settleX ?: number, settleV ?: number) => {
	const K = k ?? 170
	const C = c ?? 18
	const SX = settleX ?? 0.5
	const SV = settleV ?? 30
	let timer : number | null = null
	let gen = 0
	const cancel = () => {
		gen++
		if (timer != null) {
			clearTimeout(timer)
			timer = null
		}
	}
	// v0 单位 px/s（clamp 防病态值进积分）；onUpdate 每帧收当前位置（终帧收 to 精确值）；
	// c 可按次覆盖阻尼（过冲幅度归一用，缺省=构造值）
	const run = (from : number, to : number, v0 : number, onUpdate : (x : number) => void, onDone ?: () => void, c ?: number) => {
		cancel()
		const CC = c ?? C
		let x = from
		let v = Math.max(-2000, Math.min(2000, v0))
		let last = Date.now()
		const myGen = gen
		const tick = () => {
			if (myGen !== gen) {
				return
			}
			const now = Date.now()
			const dt = Math.min(0.04, (now - last) / 1000)
			last = now
			v += (-K * (x - to) - CC * v) * dt
			x += v * dt
			if (Math.abs(x - to) < SX && Math.abs(v) < SV) {
				onUpdate(to)
				onDone?.()
				return
			}
			onUpdate(x)
			timer = setTimeout(tick, 16)
		}
		tick()
	}
	return { cancel, run }
}
