import { Node, Program, TransformationContext } from 'typescript';

import type { TransformerConfig } from './config';
import { getComposedFunctionData } from './getComposedFunctionData';
import { isComposeCallExpression } from './isComposeCallExpression';
import { isComposeImportExpression } from './isComposeImportExpression';
import { parametersNameArray } from './parametersNameArray';
import { typeToPathMap } from './typeToPathMap';
import { Identifiers } from './typings';

export const visitor = (
    node: Node,
    program: Program,
    context: TransformationContext,
    { libName, composeName }: Identifiers,
    config: TransformerConfig
): Node | undefined => {
    if (!node) return node;

    const typeChecker = program.getTypeChecker();

    if (isComposeImportExpression(node, config)) {
        const importNode = context.factory.createVariableStatement(undefined, [
            context.factory.createVariableDeclaration(
                libName,
                undefined,
                undefined,
                context.factory.createCallExpression(
                    context.factory.createIdentifier('require'),
                    undefined,
                    [context.factory.createStringLiteral(config.modulePath)]
                )
            ),
        ]);

        return importNode;
    }

    if (!isComposeCallExpression(node, typeChecker, config)) {
        return node;
    }

    const [fun, ...otherArguments] = node.arguments;

    const composedFunctionData = getComposedFunctionData(fun, typeChecker);

    if (composedFunctionData) {
        const [parameters, returnType] = composedFunctionData;

        return context.factory.createCallExpression(
            context.factory.createPropertyAccessExpression(
                libName,
                composeName
            ),
            undefined,
            [
                fun,
                parametersNameArray(parameters, context.factory),
                context.factory.createObjectLiteralExpression(
                    typeToPathMap(returnType, typeChecker, context.factory)
                ),
                ...otherArguments,
            ]
        );
    }

    return node;
};
