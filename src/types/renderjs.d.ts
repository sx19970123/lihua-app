// refresh-content 的 renderjs 模块在模板中以模块名引用（:change:prop="renderBiz.propObserver"），
// vue-tsc 无法从 <script module="renderBiz" lang="renderjs"> 推导类型，按 uni-app renderjs 观察器签名全局声明。
// 本文件必须保持模块身份（import 'vue' + export {}）才能作为声明合并而非重声明（后者会遮蔽 vue 真实类型）。
import 'vue'

declare module 'vue' {
	interface ComponentCustomProperties {
		renderBiz: {
			propObserver: (newValue: any, oldValue?: any, ownerInstance?: any, instance?: any) => void
		}
	}
}

export {}
