export interface TreeNode {
    children?: TreeNode[];
}

function forEachNode(nodes: TreeNode[],parentNode: TreeNode, callback: (node: TreeNode) => any) {

    if (parentNode !== undefined) {
        nodes = parentNode.children;
    } 

    if (nodes != undefined) {
        for (const node of nodes) {
            callback(node);
            forEachNode(nodes, node, callback);
        }
    }
}

export function findNode<T extends TreeNode>(nodes: T[], predicate: (value: T) => boolean): T | undefined {
    let result: T;

    forEachNode(nodes, undefined, (n: T) => {
        if (predicate(n)) {
            result = n;
        }
    });

    return result;
}
