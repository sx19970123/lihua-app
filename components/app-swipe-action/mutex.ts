// 侧滑互斥协调（模块级单例，跨组件实例共享）：保证同一时刻只有一行处于开态
let currentClose : (() => void) | null = null

// 新触摸开始：收起除自己外的已滑开行（自己的重滑由手势 baseX 自然接管）
export const closeOthers = (self : () => void) => {
	if (currentClose != null && currentClose !== self) {
		currentClose()
	}
}

export const markOpen = (self : () => void) => {
	// 登记前先收现有持有者：后到者顶掉先到者
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
