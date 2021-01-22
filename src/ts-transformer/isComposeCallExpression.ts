import {
    CallExpression,
    isCallExpression,
    isJSDocSignature,
    Node,
    TypeChecker,
} from 'typescript';

import type { TransformerConfig } from './config';

export function isComposeCallExpression(
    node: Node,
    typeChecker: TypeChecker,
    config: TransformerConfig
): node is CallExpression {
    if (!isCallExpression(node)) {
        return false;
    }

    const declaration = typeChecker.getResolvedSignature(node)?.declaration;

    if (
        !declaration ||
        isJSDocSignature(declaration) ||
        declaration.name?.getText() !== config.declarationName
    ) {
        return false;
    }

    try {
        return (
            require.resolve(declaration.getSourceFile().fileName) ===
            config.declarationsPath
        );
    } catch {
        return false;
    }
}
