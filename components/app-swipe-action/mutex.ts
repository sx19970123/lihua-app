// 侧滑互斥协调（模块级单例，跨组件实例共享——script setup 内声明是实例级，v-for 多实例各存各的失效）
// 只管「开态持有者唯一」这一条 UX 不变式；原并发闸（进行中计数/单活跃拖拽，CDOMThread 崩溃
// 甲胄）已随动画全面 JS 化拆除（2026-11-24：所有写入同线程全序，无在途 CSS 动画可互搏）
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
