// 树·过滤：关键字与可见 key 集（非过滤按展开态，过滤走宽松匹配）
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { TreeContext, TreeItem } from './tree-context'

export type TreeFilter = {
	// 可见 key 集（非过滤=祖先全展开；过滤=宽松语义：自身命中→整棵子树全显、后代命中→可见并下探）
	visibleKeySet : ComputedRef<Set<string>>
	// 过滤入口（空串=清除过滤，恢复展开态视图）
	filter : (value : string) => void
}

export const createTreeFilter = (ctx : TreeContext) : TreeFilter => {
	// 可见 key 集（非过滤=祖先全展开；过滤=宽松语义：自身命中→整棵子树全显、后代命中→可见并下探）
	const visibleKeySet = computed(() : Set<string> => {
		const set = new Set<string>()
		if (ctx.filtering.value) {
			walkFilter(ctx.props.data, set)
		} else {
			walk(ctx.props.data, set)
		}
		return set
	})

	const walk = (items : TreeItem[], set : Set<string>) => {
		items.forEach(item => {
			set.add(item.key)
			if (ctx.model.hasChildren(item) && ctx.expandedKeys.value.includes(item.key)) {
				walk(item.children!, set)
			}
		})
	}

	const matchSelf = (item : TreeItem) : boolean => item.title.includes(ctx.keyword.value)

	const matchTree = (item : TreeItem) : boolean => {
		if (matchSelf(item)) {
			return true
		}
		if (item.children) {
			for (let i = 0; i < item.children.length; i++) {
				if (matchTree(item.children[i])) {
					return true
				}
			}
		}
		return false
	}

	const pushAll = (item : TreeItem, set : Set<string>) => {
		set.add(item.key)
		if (item.children) {
			item.children.forEach(child => pushAll(child, set))
		}
	}

	const walkFilter = (items : TreeItem[], set : Set<string>) => {
		items.forEach(item => {
			if (matchSelf(item)) {
				pushAll(item, set)
			} else if (item.children && item.children.some(child => matchTree(child))) {
				set.add(item.key)
				walkFilter(item.children, set)
			}
		})
	}

	// 过滤入口（空串=清除过滤，恢复展开态视图）
	const filter = (value : string) => {
		ctx.keyword.value = value
	}

	return { visibleKeySet, filter }
}
