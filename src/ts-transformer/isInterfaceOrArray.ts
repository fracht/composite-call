import {
    isArrayTypeNode,
    isPropertyDeclaration,
    isPropertySignature,
    Symbol,
    TypeChecker,
} from 'typescript';

import { isTypeObject } from './isTypeObject';
import { unboxArray } from './unboxArray';

export const isInterfaceOrArray = (
    property: Symbol,
    typeChecker: TypeChecker
): boolean => {
    const propertyDeclaration = property.valueDeclaration;

    if (
        propertyDeclaration &&
        (isPropertySignature(propertyDeclaration) ||
            isPropertyDeclaration(propertyDeclaration)) &&
        propertyDeclaration.type
    ) {
        const propertyType = unboxArray(propertyDeclaration.type);

        const type = typeChecker.getTypeFromTypeNode(propertyType);

        return (
            type.isClassOrInterface() ||
            isArrayTypeNode(propertyType) ||
            isTypeObject(type, typeChecker)
        );
    }

    return false;
};
