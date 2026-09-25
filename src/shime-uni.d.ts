/// <reference types="vite/client" />
import 'vue'

// 环境变量（本文件为模块身份，全局接口须经 declare global 暴露）
declare global {
	interface ImportMetaEnv {
		readonly VITE_APP_BASE_API: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

// vue 单文件组件
declare module '*.vue' {
	import { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module "vue" {
	type Hooks = App.AppInstance & Page.PageInstance;
	interface ComponentCustomOptions extends Hooks {}

	// refresh-content 的 renderjs 模块在模板中以模块名引用（:change:prop="renderBiz.propObserver"），
	// vue-tsc 无法从 <script module="renderBiz" lang="renderjs"> 推导类型，按 uni-app renderjs 观察器签名声明；
	// 本文件以 import 'vue' + export {} 保持模块身份，此处表现为声明合并而非重声明
	//（曾误写进全局脚本文件致遮蔽 vue 真实类型，全仓 onMounted 等报 no exported member）
	interface ComponentCustomProperties {
		renderBiz: {
			propObserver: (newValue: any, oldValue?: any, ownerInstance?: any, instance?: any) => void
		}
	}
}
