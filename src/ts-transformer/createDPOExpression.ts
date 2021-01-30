import {
    ArrayTypeNode,
    isArrayTypeNode,
    isPropertyDeclaration,
    isPropertySignature,
    isTypeLiteralNode,
    isVariableDeclaration,
    NodeFactory,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    PropertyDeclaration,
    Symbol,
    SyntaxKind,
    Type,
    TypeChecker,
    TypeNode,
} from 'typescript';

import { config } from './config';
import { isInterfaceOrObjectType } from './isInterfaceOrObjectType';
import { joinPaths } from './joinPaths';
import { Identifiers } from './typings';
import { unboxPromise } from './unboxPromise';

function createOwnPathExpression(
    factory: NodeFactory,
    { libName, pathSymbolName }: Identifiers,
    path: string | undefined
): ObjectLiteralElementLike {
    return factory.createPropertyAssignment(
        factory.createComputedPropertyName(
            factory.createPropertyAccessExpression(libName, pathSymbolName)
        ),
        factory.createStringLiteral(path ?? '')
    );
}

function createDPOExpressionFromArray(
    node: ArrayTypeNode,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path: string | undefined
): ObjectLiteralExpression {
    const element = node.elementType;

    const properties = [createOwnPathExpression(factory, identifiers, path)];

    if (isTypeLiteralNode(element)) {
        const { libName, arrayItemSymbolName } = identifiers;

        properties.push(
            factory.createPropertyAssignment(
                factory.createComputedPropertyName(
                    factory.createPropertyAccessExpression(
                        libName,
                        arrayItemSymbolName
                    )
                ),
                factory.createObjectLiteralExpression(
                    element.members
                        .map((value) =>
                            isPropertySignature(value) && value.type
                                ? factory.createPropertyAssignment(
                                      value.name,
                                      createDPOExpressionFromTypeNode(
                                          value.type!,
                                          undefined,
                                          typeChecker,
                                          factory,
                                          identifiers,
                                          joinPaths(
                                              path,
                                              config.arrayItemIndexPath
                                          )
                                      )
                                  )
                                : undefined
                        )
                        .filter(
                            (value) => value !== undefined
                        ) as ObjectLiteralElementLike[]
                )
            )
        );
    } else {
        // console.log(SyntaxKind[element.kind]);
    }

    return factory.createObjectLiteralExpression(properties);
}

function createDPOExpressionFromTypeNode(
    typeNode: TypeNode,
    type: Type | undefined,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path: string | undefined
): ObjectLiteralExpression;

function createDPOExpressionFromTypeNode(
    typeNode: TypeNode | undefined,
    type: Type,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path: string | undefined
): ObjectLiteralExpression;

function createDPOExpressionFromTypeNode(
    typeNode: TypeNode | undefined,
    type: Type | undefined,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path: string | undefined
) {
    if (!type && typeNode) {
        type = typeChecker.getTypeFromTypeNode(typeNode);
    } else if (!typeNode && type) {
        type = type && unboxPromise(type, typeChecker);
        typeNode =
            type && typeChecker.typeToTypeNode(type, undefined, undefined);
    } else {
        throw new Error('you must specify type or typeNode');
    }

    type = type && unboxPromise(type, typeChecker);

    const properties: ObjectLiteralElementLike[] = [
        createOwnPathExpression(factory, identifiers, path ?? ''),
    ];

    if (typeNode && isArrayTypeNode(typeNode)) {
        const { libName, arrayItemSymbolName } = identifiers;

        properties.push(
            factory.createPropertyAssignment(
                factory.createComputedPropertyName(
                    factory.createPropertyAccessExpression(
                        libName,
                        arrayItemSymbolName
                    )
                ),
                createDPOExpressionFromArray(
                    typeNode,
                    typeChecker,
                    factory,
                    identifiers,
                    joinPaths(path, config.arrayItemIndexPath)
                )
            )
        );
    } else if (type && isInterfaceOrObjectType(type, typeChecker)) {
        const parameters = typeChecker.getPropertiesOfType(type);

        parameters.forEach((parameter) =>
            properties.push(
                factory.createPropertyAssignment(
                    parameter.getName(),
                    createDPOExpressionFromSymbol(
                        parameter,
                        typeChecker,
                        factory,
                        identifiers,
                        path
                    )
                )
            )
        );
    } else {
        console.log(
            typeNode && SyntaxKind[typeNode.kind],
            typeChecker.typeToString(type!)
        );
    }

    return factory.createObjectLiteralExpression(properties);
}

function createDPOExpressionFromSymbol(
    symbol: Symbol,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers,
    path: string | undefined
) {
    const declaration = symbol.valueDeclaration;

    let typeNode: TypeNode | undefined;
    if (
        isPropertyDeclaration(declaration) ||
        isVariableDeclaration(declaration) ||
        isPropertySignature(declaration)
    ) {
        typeNode = declaration.type;
    }

    if (typeNode) {
        return createDPOExpressionFromTypeNode(
            typeNode,
            undefined,
            typeChecker,
            factory,
            identifiers,
            joinPaths(path, symbol.getName())
        );
    }

    return factory.createObjectLiteralExpression();
}

export function createDPOExpression(
    type: Type,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers
) {
    return createDPOExpressionFromTypeNode(
        undefined,
        type,
        typeChecker,
        factory,
        identifiers,
        undefined
    );
}

// export function createDPOExpression(
//     node: Type | Symbol,
//     typeChecker: TypeChecker,
//     factory: NodeFactory,
//     identifiers: Identifiers,
//     path?: string
// ): ObjectLiteralExpression {
//     let type: Type | undefined;

//     if (isSymbol(node)) {
//         const typeNode = (node.valueDeclaration as PropertyDeclaration)?.type;
//         if (typeNode) {
//             type = typeChecker.getTypeFromTypeNode(typeNode);
//         }
//     } else {
//         type = node;
//     }

//     type = type && unboxPromise(type, typeChecker);

//     const typeNode =
//         type && typeChecker.typeToTypeNode(type, undefined, undefined);

//     const { libName, pathSymbolName, arrayItemSymbolName } = identifiers;

//     const currentPath = joinPaths(path, isSymbol(node) && node.getName());

//     const out: ObjectLiteralElementLike[] = [
//         factory.createPropertyAssignment(
//             factory.createComputedPropertyName(
//                 factory.createPropertyAccessExpression(libName, pathSymbolName)
//             ),
//             factory.createStringLiteral(currentPath)
//         ),
//     ];

//     if (type && isInterfaceOrObjectType(type, typeChecker)) {
//         const parameters = typeChecker.getPropertiesOfType(type);

//         console.log(
//             parameters.map(
//                 (value) =>
//                     (value.valueDeclaration as PropertyDeclaration).type &&
//                     typeChecker.typeToString(
//                         typeChecker.getTypeFromTypeNode(
//                             (value.valueDeclaration as PropertyDeclaration)
//                                 .type!
//                         )
//                     )
//             )
//         );

//         parameters.forEach((parameter) =>
//             out.push(
//                 factory.createPropertyAssignment(
//                     parameter.getName(),
//                     createDPOExpression(
//                         parameter,
//                         typeChecker,
//                         factory,
//                         identifiers,
//                         currentPath
//                     )
//                 )
//             )
//         );
//     }

//     return factory.createObjectLiteralExpression(out);
// }

// const isSymbol = (node: Symbol | Type): node is Symbol => 'getName' in node;
