// 树·数据拍平与展开选中：全量状态一次拍平、展开态切换、单选事件
import type { TreeContext, TreeItem, TreeState } from './tree-context'

export type TreeModel = {
	// 深度优先拍平（数据到达时由入口的数据 watch 调用）：结果追加进 out
	buildStates : (items : TreeItem[], level : number, out : TreeState[]) => void
	// 收集全部父节点 key（defaultExpandAll 时由入口的数据 watch 调用）
	collectParentKeys : (items : TreeItem[]) => string[]
	// 是否有子节点（箭头显隐与可展开判定）
	hasChildren : (item : TreeItem) => boolean
	// 箭头点击：切换展开态（过滤中、叶子不动）
	toggleByItem : (item : TreeItem) => void
	// 整行点击：选中并发事件（只读或行内加载中拒绝）
	onSelect : (item : TreeItem) => void
}

export const createTreeModel = (ctx : TreeContext) : TreeModel => {
	const buildStates = (items : TreeItem[], level : number, out : TreeState[]) => {
		items.forEach(item => {
			out.push({item, level, shown: true, arrowCls: '', showLine: false, firstVisible: false,
				nodeCls: 'app-tree-node', hitCls: 'app-tree-hit', animUntil: 0, segBefore: '', segHit: '', segAfter: ''})
			if (item.children && item.children.length > 0) {
				buildStates(item.children, level + 1, out)
			}
		})
	}

	const collectParentKeys = (items : TreeItem[]) : string[] => {
		const keys : string[] = []
		items.forEach(item => {
			if (item.children && item.children.length > 0) {
				keys.push(item.key)
				keys.push(...collectParentKeys(item.children))
			}
		})
		return keys
	}

	const hasChildren = (item : TreeItem) : boolean => !!item.children && item.children.length > 0

	const toggleByItem = (item : TreeItem) => {
		if (!hasChildren(item) || ctx.filtering.value) {
			return
		}
		const index = ctx.expandedKeys.value.indexOf(item.key)
		if (index >= 0) {
			ctx.expandedKeys.value.splice(index, 1)
		} else {
			ctx.expandedKeys.value.push(item.key)
		}
	}

	// 行内 loading 兼任操作锁：loading 期间拒绝新选中
	const onSelect = (item : TreeItem) => {
		if (ctx.props.readonly || ctx.props.loading) {
			return
		}
		ctx.emit('update:current', item.key)
		ctx.emit('select', item.key, item)
	}

	return { buildStates, collectParentKeys, hasChildren, toggleByItem, onSelect }
}
