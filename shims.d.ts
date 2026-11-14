// IDE 类型兜底合集（编译与运行时类型由 HBuilderX/V 内置处理，本文件仅消 IDEA 报红；不改编译产物）

// .uvue 模块
declare module '*.uvue' {
	const component: import('vue').DefineComponent<{}, {}, any>
	export default component
}

// 编译期注入的环境变量（uni-app x 仅支持 NODE_ENV 两态，编译期文本替换+死分支摇树）
declare var process: {
	env: {
		readonly NODE_ENV: 'development' | 'production'
	}
}
