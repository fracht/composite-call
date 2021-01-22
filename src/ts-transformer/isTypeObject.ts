import { Type, TypeChecker } from 'typescript';

export const isTypeObject = (type: Type, typeChecker: TypeChecker) => {
    const typeAsString = typeChecker.typeToString(type);

    return typeAsString.startsWith('{') && typeAsString.endsWith('}');
};
