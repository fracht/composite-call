import path from 'path';
import ts from 'typescript';

const indexTs = path.join(__dirname, 'index.d.ts');
const indexJs = path.join(__dirname, 'index.js');
const declarationName = 'compose';
const callFunctionName = '__compose';
const modulePath = 'composite-call';

export default function transformer(
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
        const libName = context.factory.createUniqueName('compositeCall');
        const composeName = context.factory.createIdentifier(callFunctionName);
        const transformedFile = visitNodeAndChildren(file, program, context, {
            libName,
            composeName,
        });
        return transformedFile;
    };
}

type Identifiers = {
    libName: ts.Identifier;
    composeName: ts.Identifier;
};

function visitNodeAndChildren(
    file: ts.SourceFile,
    program: ts.Program,
    context: ts.TransformationContext,
    identifiers: Identifiers
): ts.SourceFile;

function visitNodeAndChildren(
    file: ts.Node,
    program: ts.Program,
    context: ts.TransformationContext,
    identifiers: Identifiers
): ts.Node | undefined;

function visitNodeAndChildren(
    node: ts.Node,
    program: ts.Program,
    context: ts.TransformationContext,
    identifiers: Identifiers
): ts.Node | undefined {
    return ts.visitEachChild(
        visitNode(node, program, context, identifiers),
        (child) => visitNodeAndChildren(child, program, context, identifiers),
        context
    );
}

const isTypeObject = (type: ts.Type, typeChecker: ts.TypeChecker) => {
    const typeAsString = typeChecker.typeToString(type);

    return typeAsString.startsWith('{') && typeAsString.endsWith('}');
};

const isTypeInterfaceOrArray = (
    type: ts.Type,
    typeChecker: ts.TypeChecker
): boolean => {
    return (
        type.isClassOrInterface() ||
        ts.isArrayTypeNode(
            typeChecker.typeToTypeNode(type, undefined, undefined)!
        ) ||
        isTypeObject(type, typeChecker)
    );
};

const isInterfaceOrArray = (
    property: ts.Symbol,
    typeChecker: ts.TypeChecker
): boolean => {
    const propertyDeclaration = property.valueDeclaration;

    if (
        propertyDeclaration &&
        ts.isPropertyDeclaration(propertyDeclaration) &&
        propertyDeclaration.type
    ) {
        const propertyType = unbox(propertyDeclaration.type);

        const type = typeChecker.getTypeFromTypeNode(propertyType);

        return (
            type.isClassOrInterface() ||
            ts.isArrayTypeNode(propertyType) ||
            isTypeObject(type, typeChecker)
        );
    }
    return false;
};

const joinPaths = (...arr: (string | undefined)[]) =>
    arr.filter(Boolean).join('.');

const symbolToPathMapElement = (
    symbol: ts.Symbol,
    factory: ts.NodeFactory,
    path: string | undefined
) => {
    const fullPath = joinPaths(path, symbol.getName());
    return factory.createPropertyAssignment(
        factory.createStringLiteral(fullPath),
        factory.createStringLiteral(fullPath)
    );
};

const unbox = (typeNode: ts.TypeNode) => {
    while (ts.isArrayTypeNode(typeNode)) {
        typeNode = typeNode.elementType;
    }
    return typeNode;
};

const unboxPromise = (type: ts.Type, typeChecker: ts.TypeChecker) => {
    if (type.getSymbol()?.getName() === 'Promise') {
        const unpackedType = typeChecker.getTypeArguments(
            type as ts.TypeReference
        )[0];
        return unpackedType ?? type;
    }

    return type;
};

const unboxPropertyDeclaration = (
    node: ts.Node
    // typeChecker: ts.TypeChecker
) => {
    if (ts.isPropertyAccessExpression(node) || ts.isPropertyAccessChain(node)) {
        return node.name;
    }

    return node;
};

const parametersNameArray = (
    parameters: string[],
    factory: ts.NodeFactory
): ts.ArrayLiteralExpression => {
    return factory.createArrayLiteralExpression(
        parameters.map((parameter) => factory.createStringLiteral(parameter))
    );
};

const typeToPathMap = (
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

const symbolToPathMap = (
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
            typeChecker.getTypeFromTypeNode(unbox(type))
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

const getComposedFunctionData = (
    fun: ts.Node,
    typeChecker: ts.TypeChecker
): [string[], ts.Type] | undefined => {
    fun = unboxPropertyDeclaration(fun);
    if (ts.isIdentifier(fun)) {
        const declaration = typeChecker
            .getSymbolAtLocation(fun)
            ?.getDeclarations()?.[0];

        if (
            declaration &&
            (ts.isVariableDeclaration(declaration) ||
                ts.isPropertyDeclaration(declaration)) &&
            declaration.initializer &&
            ts.isArrowFunction(declaration.initializer)
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
            (ts.isFunctionDeclaration(declaration) ||
                ts.isMethodDeclaration(declaration))
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

const visitNode = (
    node: ts.Node,
    program: ts.Program,
    context: ts.TransformationContext,
    { libName, composeName }: Identifiers
): ts.Node | undefined => {
    if (!node) return node;

    const typeChecker = program.getTypeChecker();

    if (isComposeImportExpression(node)) {
        const importNode = context.factory.createVariableStatement(undefined, [
            context.factory.createVariableDeclaration(
                libName,
                undefined,
                undefined,
                context.factory.createCallExpression(
                    context.factory.createIdentifier('require'),
                    undefined,
                    [context.factory.createStringLiteral(modulePath)]
                )
            ),
        ]);

        return importNode;
    }

    if (!isComposeCallExpression(node, typeChecker)) {
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

function isComposeImportExpression(
    node: ts.Node
): node is ts.ImportDeclaration {
    if (!ts.isImportDeclaration(node)) {
        return false;
    }
    const module = (node.moduleSpecifier as ts.StringLiteral).text;

    try {
        return (
            indexJs ===
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

function isComposeCallExpression(
    node: ts.Node,
    typeChecker: ts.TypeChecker
): node is ts.CallExpression {
    if (!ts.isCallExpression(node)) {
        return false;
    }

    const declaration = typeChecker.getResolvedSignature(node)?.declaration;

    if (
        !declaration ||
        ts.isJSDocSignature(declaration) ||
        declaration.name?.getText() !== declarationName
    ) {
        return false;
    }

    try {
        return (
            require.resolve(declaration.getSourceFile().fileName) === indexTs
        );
    } catch {
        return false;
    }
}
