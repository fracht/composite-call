import { Type, TypeChecker, TypeReference } from 'typescript';

export const unboxPromise = (type: Type, typeChecker: TypeChecker) => {
    if (type.getSymbol()?.getName() === 'Promise') {
        const unpackedType = typeChecker.getTypeArguments(
            type as TypeReference
        )[0];
        return unpackedType ?? type;
    }

    return type;
};
