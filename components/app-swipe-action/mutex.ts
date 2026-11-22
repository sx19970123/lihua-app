// 侧滑互斥协调（模块级单例，跨组件实例共享——script setup 内声明是实例级，v-for 多实例各存各的失效）
let currentClose : (() => void) | null = null

// 新触摸开始：收起除自己外的已滑开行（自己的重滑由手势 baseX 自然接管）
export const closeOthers = (self : () => void) => {
	if (currentClose != null && currentClose !== self) {
		currentClose()
	}
}

export const markOpen = (self : () => void) => {
	// 登记前先收现有持有者：多指下两行先后进入拖拽/开启，后到者顶掉先到者（先到者
	// 若在拖拽中会被 closeSelf 打断），保证持有者唯一、任何顺序下都只有一行开
	if (currentClose != null && currentClose !== self) {
		currentClose()
	}
	currentClose = self
}

export const clearOpen = (self : () => void) => {
	if (currentClose === self) {
		currentClose = null
	}
}

// 进行中并发闸（行三态：关闭/进行中/打开——闸只数「进行中」），单表管全部并发：
// 每行一个槽（同一时刻拖拽或动画二选一），到期自然过期；拖拽=∞ 槽（DRAG_HOLD
// 哨兵）——「他行拖拽中」判定（单活跃拖拽，多指并发压成单写者）与「进行中计数」
// （全局 <2 才放行新横滑，如 A 滑收+B 拖拽合法并存）同出此表
const progress = new Map<() => void, number>()
const DRAG_HOLD = Number.MAX_SAFE_INTEGER

// 进入/刷新进行中：ms>0=动画类占用时长；0=拖拽（∞ 槽，松手/被打断时 release 后由动画打点接管）
export const progressHold = (self : () => void, ms : number) => {
	const until = ms > 0 ? Date.now() + ms : DRAG_HOLD
	const old = progress.get(self)
	if (old == null || until > old) {
		progress.set(self, until)
	}
}

export const progressRelease = (self : () => void) => {
	progress.delete(self)
}

export const progressCount = () : number => {
	const now = Date.now()
	progress.forEach((until, key) => {
		if (until <= now) {
			progress.delete(key)
		}
	})
	return progress.size
}

// 他行拖拽中？（∞ 槽不会过期，无须清表）——拖拽单活跃闸：同时最多一行在手势驱动
export const hasOtherDrag = (self : () => void) : boolean => {
	let found = false
	progress.forEach((until, key) => {
		if (key !== self && until === DRAG_HOLD) {
			found = true
		}
	})
	return found
}
