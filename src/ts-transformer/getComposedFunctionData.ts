import {
    isArrowFunction,
    isFunctionDeclaration,
    isIdentifier,
    isMethodDeclaration,
    isPropertyDeclaration,
    isVariableDeclaration,
    Node,
    Type,
    TypeChecker,
} from 'typescript';

import { unboxPropertyDeclaration } from './unboxPropertyDeclaration';

export type ComposedFunctionData = [string[], Type];

export const getComposedFunctionData = (
    fun: Node,
    typeChecker: TypeChecker
): ComposedFunctionData | undefined => {
    fun = unboxPropertyDeclaration(fun);
    if (isIdentifier(fun)) {
        const declaration = typeChecker
            .getSymbolAtLocation(fun)
            ?.getDeclarations()?.[0];

        if (
            declaration &&
            (isVariableDeclaration(declaration) ||
                isPropertyDeclaration(declaration)) &&
            declaration.initializer &&
            isArrowFunction(declaration.initializer)
        ) {
            const initializer = declaration.initializer;

            if (initializer.type) {
                return [
                    initializer.parameters.map((param) => param.name.getText()),
                    typeChecker.getTypeFromTypeNode(initializer.type),
                ];
            }
        }

        if (
            declaration &&
            (isFunctionDeclaration(declaration) ||
                isMethodDeclaration(declaration))
        ) {
            const signature = typeChecker.getSignatureFromDeclaration(
                declaration
            );

            if (signature) {
                return [
                    signature.parameters.map((param) => param.getName()),
                    signature.getReturnType(),
                ];
            }
        }
    }

    return undefined;
};
