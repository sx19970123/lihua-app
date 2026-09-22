const DEFAULT_CHILDREN = "children";

/**
 * 树形结构遍历
 * @param tree 树形结构数组
 * @param callback 树形结构遍历回调函数，回调参数为节点元素
 * @param children 子集节点容器名称 默认 children
 */
export const traverse = <T> (tree: Array<T>, callback: (item: T) => void | boolean, children: string = DEFAULT_CHILDREN) => {
	for(const item of tree) {
		if (callback(item) === true) {
			return true
		}
		const itemChildren = (item as any)[children]
		if (itemChildren && itemChildren.length > 0) {
			if (traverse(itemChildren, callback, children)) {
				return true
			}
		}
	}
	
	return false
}

/**
 * 遍历树结构并回调每个节点，callback 返回值将被收集成数组。
 * @param tree 树形数组
 * @param callback 每个节点调用的回调函数，参数为 (path: T[])，包含从根到当前节点的完整路径
 * @param children 子节点字段名，默认 'children'
 */
export const traverseWithPath = <T> (tree: T[], callback: (path: T[]) => any, children: string = DEFAULT_CHILDREN) => {
  const result: any[] = [];

  const dfs = (nodes: T[], path: T[]) => {
    for (const node of nodes) {
      const newPath = [...path, node];
      // 收集 callback 返回值
      result.push(callback(newPath));

      const childList = (node as any)[children];
      if (Array.isArray(childList) && childList.length > 0) {
        dfs(childList, newPath);
      }
    }
  };

  dfs(tree, []);
  return result;
}

