import {
    isPropertyAccessChain,
    isPropertyAccessExpression,
    Node,
} from 'typescript';

export const unboxPropertyDeclaration = (node: Node) => {
    if (isPropertyAccessExpression(node) || isPropertyAccessChain(node)) {
        return node.name;
    }

    return node;
};
