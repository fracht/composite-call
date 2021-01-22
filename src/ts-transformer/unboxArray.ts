import { isArrayTypeNode, TypeNode } from 'typescript';

export const unboxArray = (typeNode: TypeNode) => {
    while (isArrayTypeNode(typeNode)) {
        typeNode = typeNode.elementType;
    }
    return typeNode;
};
