import ts from 'typescript';

import { isInterfaceOrArray } from './isInterfaceOrArray';
import { joinPaths } from './joinPaths';
import { symbolToPathMapElement } from './symbolToPathMapElement';
import { unboxArray } from './unboxArray';

export const symbolToPathMap = (
    symbol: ts.Symbol,
    typeChecker: ts.TypeChecker,
    factory: ts.NodeFactory,
    path?: string
): ts.ObjectLiteralElementLike[] => {
    const type = (symbol.valueDeclaration as ts.PropertyDeclaration)?.type;

    const out: ts.ObjectLiteralElementLike[] = [
        symbolToPathMapElement(symbol, factory, path),
    ];

    if (type && isInterfaceOrArray(symbol, typeChecker)) {
        const parameters = typeChecker.getPropertiesOfType(
            typeChecker.getTypeFromTypeNode(unboxArray(type))
        );

        const currentPath = joinPaths(path, symbol.getName());

        parameters.forEach((parameter) =>
            out.push(
                ...symbolToPathMap(parameter, typeChecker, factory, currentPath)
            )
        );
    }

    return out;
};
