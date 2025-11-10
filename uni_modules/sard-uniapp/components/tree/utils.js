export function recurDescendant(node, callback) {
    if (!callback(node) && node.children) {
        node.children.forEach((node) => {
            recurDescendant(node, callback);
        });
    }
}
export function recurAncestor(node, callback) {
    if (node) {
        callback(node);
        recurAncestor(node.parent, callback);
    }
}
export function recurNodes(nodes, callback) {
    nodes.forEach((node) => {
        callback(node);
        if (node.children) {
            recurNodes(node.children, callback);
        }
    });
}
export function getNodeLevel(node) {
    let level = 0;
    while (node.parent) {
        level++;
        node = node.parent;
    }
    return level;
}
