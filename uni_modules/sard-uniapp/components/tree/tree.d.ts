import { type TreeProps, type TreeNode, type TreeStateNode, type TreeCleanNode } from './common';
declare const _default: import("vue").DefineComponent<TreeProps, {
    setExpanded: (key: string | number, expanded: boolean) => void;
    toggleExpanded: (key: string | number) => void;
    setExpandedKeys: (keys: (string | number)[]) => void;
    getExpandedKeys: () => (string | number)[];
    getCheckedKeys: () => (string | number)[];
    getHalfCheckedKeys: () => (string | number)[];
    setCheckedKeys: (keys: (string | number)[]) => void;
    setChecked: (key: string | number, checked: boolean) => void;
    addRootNode: () => void;
    getCleanTreeData: () => TreeCleanNode[];
    filter: (searchString: string) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (key: string | number, node: TreeStateNode) => any;
    "update:current": (key: string | number, node: TreeStateNode) => any;
    check: (event: {
        checked: boolean;
        node: TreeStateNode;
    }) => any;
    "node-click": (event: {
        event: any;
        node: TreeStateNode;
    }) => any;
}, string, import("vue").PublicProps, Readonly<TreeProps> & Readonly<{
    onSelect?: ((key: string | number, node: TreeStateNode) => any) | undefined;
    "onUpdate:current"?: ((key: string | number, node: TreeStateNode) => any) | undefined;
    onCheck?: ((event: {
        checked: boolean;
        node: TreeStateNode;
    }) => any) | undefined;
    "onNode-click"?: ((event: {
        event: any;
        node: TreeStateNode;
    }) => any) | undefined;
}>, {
    data: TreeNode[];
    lazy: boolean;
    load: (node?: TreeStateNode) => Promise<TreeNode[]> | TreeNode[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    accordion: boolean;
    draggable: boolean;
    current: string | number;
    selectable: boolean;
    editable: boolean;
    singleSelectable: boolean;
    leafOnly: boolean;
    nodeKeys: import("./common").TreeNodeKeys;
    defaultExpandAll: boolean;
    defaultExpandedKeys: (string | number)[];
    checkStrictly: boolean;
    defaultCheckedKeys: (string | number)[];
    filterMode: "lenient" | "strict";
    filterMethod: (value: string, node: TreeStateNode) => boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
