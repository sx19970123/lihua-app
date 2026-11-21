// 物理弹簧引擎（欠阻尼积分）：16ms setTimeout 链+代际 token（cancel 后已入队帧不执行）
// k=170/c=18——多周期果冻振荡；初速 v0 承接松手末速度（fling 惯性自然衰减成弹）
// 消费方：app-segmented 滑块弹簧 / app-swipe-action 惯性收起——回调驱动（onUpdate 收每帧位置）
export const createSpringControl = () => {
	let timer : number | null = null
	let gen = 0
	const cancel = () => {
		gen++
		if (timer != null) {
			clearTimeout(timer)
			timer = null
		}
	}
	// v0 单位 px/s（clamp 防病态值进积分）；onUpdate 每帧收当前位置（终帧收 to 精确值）
	const run = (from : number, to : number, v0 : number, onUpdate : (x : number) => void, onDone ?: () => void) => {
		cancel()
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
			v += (-170 * (x - to) - 18 * v) * dt
			x += v * dt
			if (Math.abs(x - to) < 0.5 && Math.abs(v) < 30) {
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
