import { Type, TypeChecker } from 'typescript';

import { isTypeObject } from './isTypeObject';

export const isInterfaceOrObjectType = (
    type: Type,
    typeChecker: TypeChecker
): boolean => {
    return type.isClassOrInterface() || isTypeObject(type, typeChecker);
};
