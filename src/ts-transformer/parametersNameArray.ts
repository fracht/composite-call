import ts from 'typescript';

export const parametersNameArray = (
    parameters: string[],
    factory: ts.NodeFactory
): ts.ArrayLiteralExpression => {
    return factory.createArrayLiteralExpression(
        parameters.map((parameter) => factory.createStringLiteral(parameter))
    );
};
