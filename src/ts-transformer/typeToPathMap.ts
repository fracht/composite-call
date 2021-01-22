import ts from 'typescript';

import { isTypeInterfaceOrArray } from './isTypeInterfaceOrArray';
import { symbolToPathMap } from './symbolToPathMap';
import { unboxPromise } from './unboxPromise';

export const typeToPathMap = (
    type: ts.Type,
    typeChecker: ts.TypeChecker,
    factory: ts.NodeFactory
): ts.ObjectLiteralElementLike[] => {
    type = unboxPromise(type, typeChecker);

    if (isTypeInterfaceOrArray(type, typeChecker)) {
        const parameters = typeChecker.getPropertiesOfType(type);

        const out: ts.ObjectLiteralElementLike[] = [];

        parameters.forEach((symbol) =>
            out.push(...symbolToPathMap(symbol, typeChecker, factory))
        );

        return out;
    }

    return [];
};
