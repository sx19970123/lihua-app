import { defaultConfig } from '../config';
export const defaultNodeKeys = {
    title: 'title',
    key: 'key',
    children: 'children',
    isLeaf: 'isLeaf',
};
export const defaultTreeProps = () => ({
    ...defaultConfig.tree,
    data: () => [],
});
export const treeContextSymbol = Symbol('tree-context');
