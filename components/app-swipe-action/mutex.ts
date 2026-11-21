// 侧滑互斥协调（模块级单例，跨组件实例共享——script setup 内声明是实例级，v-for 多实例各存各的失效）
let currentClose : (() => void) | null = null

// 新触摸开始：收起除自己外的已滑开行（自己的重滑由手势 baseX 自然接管）
export const closeOthers = (self : () => void) => {
	if (currentClose != null && currentClose !== self) {
		currentClose()
	}
}

export const markOpen = (self : () => void) => {
	currentClose = self
}

export const clearOpen = (self : () => void) => {
	if (currentClose === self) {
		currentClose = null
	}
}
