import {
    NodeFactory,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    PropertyDeclaration,
    Symbol,
    TypeChecker,
} from 'typescript';

import { isInterfaceOrArray } from './isInterfaceOrArray';
import { joinPaths } from './joinPaths';
import { Identifiers } from './typings';
import { unboxArray } from './unboxArray';

export const symbolToRecordObjectLiteralExpression = (
    symbol: Symbol,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path?: string
): ObjectLiteralExpression => {
    const type = (symbol.valueDeclaration as PropertyDeclaration)?.type;

    const { libName, pathSymbolName } = identifiers;

    const currentPath = joinPaths(path, symbol.getName());

    const out: ObjectLiteralElementLike[] = [
        factory.createPropertyAssignment(
            factory.createComputedPropertyName(
                factory.createPropertyAccessExpression(libName, pathSymbolName)
            ),
            factory.createStringLiteral(currentPath)
        ),
    ];

    if (type && isInterfaceOrArray(symbol, typeChecker)) {
        const parameters = typeChecker.getPropertiesOfType(
            typeChecker.getTypeFromTypeNode(unboxArray(type))
        );

        parameters.forEach((parameter) =>
            out.push(
                factory.createPropertyAssignment(
                    parameter.getName(),
                    symbolToRecordObjectLiteralExpression(
                        parameter,
                        typeChecker,
                        factory,
                        identifiers,
                        currentPath
                    )
                )
            )
        );
    }

    return factory.createObjectLiteralExpression(out);
};
