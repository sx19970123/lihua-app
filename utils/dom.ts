// 按 id 取 Web 端 DOM 元素（组件内命令式写样式用）；其余端没有 DOM，返回 null
// #ifdef WEB
export const domElementById = (id : string) : any => {
	return document.getElementById(id)
}
// #endif
// #ifndef WEB
export const domElementById = (_id : string) : any => {
	return null
}
// #endif
