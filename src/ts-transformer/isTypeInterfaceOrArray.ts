import { isArrayTypeNode, Type, TypeChecker } from 'typescript';

import { isTypeObject } from './isTypeObject';

export const isTypeInterfaceOrArray = (
    type: Type,
    typeChecker: TypeChecker
): boolean => {
    return (
        type.isClassOrInterface() ||
        isArrayTypeNode(
            typeChecker.typeToTypeNode(type, undefined, undefined)!
        ) ||
        isTypeObject(type, typeChecker)
    );
};
