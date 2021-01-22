import { Node, Program, TransformationContext } from 'typescript';

import type { TransformerConfig } from './config';
import { createComposeCallExpression } from './createComposeCallExpression';
import { getComposedFunctionData } from './getComposedFunctionData';
import { isComposeCallExpression } from './isComposeCallExpression';
import { isComposeImportExpression } from './isComposeImportExpression';
import { Identifiers } from './typings';

export const visitor = (
    node: Node,
    program: Program,
    context: TransformationContext,
    identifiers: Identifiers,
    config: TransformerConfig
): Node | undefined => {
    if (!node) return node;

    const { libName } = identifiers;

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
        return createComposeCallExpression(
            composedFunctionData,
            identifiers,
            fun,
            otherArguments,
            context,
            typeChecker
        );
    }

    return node;
};
