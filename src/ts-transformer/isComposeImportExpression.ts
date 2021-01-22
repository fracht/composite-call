import path from 'path';
import {
    ImportDeclaration,
    isImportDeclaration,
    Node,
    StringLiteral,
} from 'typescript';

import type { TransformerConfig } from './config';

export function isComposeImportExpression(
    node: Node,
    { composeFunctionPath }: TransformerConfig
): node is ImportDeclaration {
    if (!isImportDeclaration(node)) {
        return false;
    }
    const module = (node.moduleSpecifier as StringLiteral).text;

    try {
        return (
            composeFunctionPath ===
            (module.startsWith('.')
                ? require.resolve(
                      path.resolve(
                          path.dirname(node.getSourceFile().fileName),
                          module
                      )
                  )
                : require.resolve(module))
        );
    } catch (e) {
        return false;
    }
}
