import { type TreeStateNode } from './common';
export declare function recurDescendant(node: TreeStateNode, callback: (node: TreeStateNode) => boolean | void | undefined): void;
export declare function recurAncestor(node: TreeStateNode | null, callback: (node: TreeStateNode) => void): void;
export declare function recurNodes(nodes: TreeStateNode[], callback: (node: TreeStateNode) => void): void | boolean;
export declare function getNodeLevel(node: TreeStateNode): number;
