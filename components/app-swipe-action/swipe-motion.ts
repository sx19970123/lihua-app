// 侧滑·位移驱动与补间：有效位移折算、双侧进度换算、行运动补间引擎与弹簧回位
import { rubber } from '@/utils/damping'
import { markOpen } from './mutex'
import { SIDE_L, SIDE_R } from './swipe-platform'
import type { SwipeContext } from './swipe-context'

// 补间控制器：run=300ms easeOutQuad setTimeout 链（代际 token，cancel 后已入队帧不执行）
export type SwipeTweenControl = { cancel : () => void, run : (step : (e : number) => void, done ?: () => void) => void }

export type SwipeMotion = {
	// 区间钳
	clamp : (v : number, min : number, max : number) => number
	// 有限值守卫：NaN/Infinity 传进 setProperty 会致原生崩溃
	safe : (v : number, fallback : number) => number
	// 内容层位移统一口：x 直用（负=左移让右侧 / 正=右移让左侧）
	driveContent : (x : number) => void
	// 有效位移：content 实际落点——跨域阻尼/橡皮筋饱和后的值
	effOf : (x : number) => number
	// 总驱动：content 落有效位移；两侧进度各自换算，x<0 只驱动右组、x>0 只驱动左组
	drive : (x : number) => void
	// 行运动补间控制器（开/收补间与确认态收起的逐钮直写补间共用）
	springCtl : SwipeTweenControl
	// loading 抵达时 spinner 与文字归心的补间控制器
	confirmCtl : SwipeTweenControl
	// 行运动补间停表
	cancelSpringTween : () => void
	// 弹簧回位补间（引擎驱动）：内容+彩带 width 同帧，终态移交 openAt 就位
	springReturn : () => void
	// 行运动补间（开/收共用）：从当前 currentX 到目标 300ms easeOut
	glideTo : (target : number) => void
}

export const createSwipeMotion = (ctx : SwipeContext) : SwipeMotion => {
	const clamp = (v : number, min : number, max : number) : number => v < min ? min : (v > max ? max : v)

	// 有限值守卫：NaN/Infinity 传进 setProperty 会致原生崩溃
	const safe = (v : number, fallback : number) : number => (isFinite(v) ? v : fallback)

	// ---------- 位移驱动（单变量 p=展开进度，0=收起 1=展开 >1=橡皮筋段） ----------
	// 内容层位移统一口：x 直用（负=左移让右侧 / 正=右移让左侧）
	const driveContent = (x : number) => {
		ctx.platform.content('transform', `translateX(${x}px)`)
	}

	// 橡皮筋：渐近幅度 d=该侧组宽的 0.25（下限 32），见 utils/damping.ts
	const rubberOf = (total : number, excess : number) : number => {
		return rubber(excess, total > 0 ? Math.max(32, total * 0.25) : 32)
	}

	// 有效位移：content 实际落点——跨域阻尼/橡皮筋饱和后的值（原始 x 可到 ±6W，不限会把 item 拖飞）
	const effOf = (x : number) : number => {
		const wr = ctx.sides[SIDE_R].g.total
		const wl = ctx.sides[SIDE_L].g.total
		if (ctx.crossDamp === SIDE_L && x > 0 && wl > 0) {
			// 跨域阻尼：开态起拖压向对侧，对侧域自中线起整段衰减
			return rubberOf(wl, x)
		}
		if (ctx.crossDamp === SIDE_R && x < 0 && wr > 0) {
			return -rubberOf(wr, -x)
		}
		if (x < 0 && wr > 0 && -x > wr) {
			return -(wr + rubberOf(wr, -x - wr))
		}
		if (x > 0 && wl > 0 && x > wl) {
			return wl + rubberOf(wl, x - wl)
		}
		return x
	}

	// 补间引擎：300ms easeOutQuad setTimeout 链（代际 token，cancel 后已入队帧不执行）
	const createTweenControl = () : SwipeTweenControl => {
		let timer : number | null = null
		let gen = 0
		const cancel = () => {
			gen++
			if (timer != null) {
				clearTimeout(timer)
				timer = null
			}
		}
		// step 收缓动比例 e∈[0,1]；done=终帧回调（被 cancel 不触发）
		const run = (step : (e : number) => void, done ?: () => void) => {
			cancel()
			const t0 = Date.now()
			const myGen = gen
			const tick = () => {
				if (myGen !== gen) {
					return
				}
				const k = clamp((Date.now() - t0) / 300, 0, 1)
				const e = 1 - (1 - k) * (1 - k)
				step(e)
				if (k < 1) {
					timer = setTimeout(tick, 16)
				} else {
					timer = null
					done?.()
				}
			}
			tick()
		}
		return { cancel, run }
	}
	const springCtl = createTweenControl()
	const confirmCtl = createTweenControl()

	// 弹簧回位补间（引擎驱动）：内容+彩带 width 同帧，终态移交 openAt 就位
	const cancelSpringTween = () => { springCtl.cancel() }

	const springReturn = () => {
		cancelSpringTween()
		markOpen(ctx.gear.closeSelf)
		// 发生侧=超界侧（currentX 符号）；起点=视觉 over（rubber 饱和后）
		const s = ctx.currentX < 0 ? ctx.sides[SIDE_R] : ctx.sides[SIDE_L]
		const g = s.g
		const raw = Math.abs(ctx.currentX) - g.total
		const startOver = raw > 0 ? rubberOf(g.total, raw) : 0
		if (startOver <= 0) {
			ctx.gear.openAt(s)
			return
		}
		const n = g.fan.length
		const leftSide = s.fixedSign < 0
		springCtl.run((e : number) => {
			const over = safe(startOver * (1 - e), 0)
			for (let i = 0; i < n; i++) {
				const add = over * (n - i) / n
				s.wBtn(i, 'width', `${safe(g.fan[i] + add, g.fan[i])}px`)
				if (leftSide) {
					// 左组：文字随右缘延展同步平移（driveAt 弹簧分支同款——右组锚右缘天然跟移免补）
					s.wText(i, 'margin-left', `${safe((g.margins[i] ?? 0) + add, g.margins[i] ?? 0)}px`)
				}
			}
			ctx.currentX = safe(-s.fixedSign * (g.total + over), -s.fixedSign * g.total)
			driveContent(ctx.currentX)
		}, () => {
			s.clearSpringDirty()
			ctx.gear.openAt(s)
		})
	}

	// 总驱动：content 落有效位移；两侧进度各自换算，x<0 只驱动右组、x>0 只驱动左组
	const drive = (x : number) => {
		const effX = effOf(x)
		const wr = ctx.sides[SIDE_R].g.total
		const wl = ctx.sides[SIDE_L].g.total
		driveContent(effX)
		// p 只设下限 0；按钮延展与 content 超出走同一曲线
		if (wr > 0) {
			const pr = Math.max(0, -effX / wr)
			ctx.sides[SIDE_R].driveAt(pr)
		}
		if (wl > 0) {
			const pl = Math.max(0, effX / wl)
			ctx.sides[SIDE_L].driveAt(pl)
		}
	}

	// 行运动补间（开/收共用）：从当前 currentX 到目标 300ms easeOut
	const glideTo = (target : number) => {
		const fromX = ctx.currentX
		if (Math.abs(target - fromX) < 0.5) {
			ctx.currentX = target
			drive(target)
			return
		}
		springCtl.run((e : number) => {
			ctx.currentX = fromX + (target - fromX) * e
			driveContent(ctx.currentX)
			// 进度钳 1（绕开 drive 的橡皮筋段：过界态起收会触发宽度拉伸写；两侧分调同款换算）
			ctx.sides[SIDE_R].driveAt(clamp(-ctx.currentX / Math.max(1, ctx.sides[SIDE_R].g.total), 0, 1))
			ctx.sides[SIDE_L].driveAt(clamp(ctx.currentX / Math.max(1, ctx.sides[SIDE_L].g.total), 0, 1))
		}, () => {
			ctx.currentX = target
			drive(target)
		})
	}
	return { clamp, safe, driveContent, effOf, drive, springCtl, confirmCtl, cancelSpringTween, springReturn, glideTo }
}
