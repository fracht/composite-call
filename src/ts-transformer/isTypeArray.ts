import { isArrayTypeNode, Type, TypeChecker } from 'typescript';

export const isTypeArray = (type: Type, typeChecker: TypeChecker): boolean =>
    isArrayTypeNode(typeChecker.typeToTypeNode(type, undefined, undefined)!);
