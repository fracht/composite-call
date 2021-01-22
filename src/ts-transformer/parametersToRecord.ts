import { Expression, NodeFactory, ObjectLiteralExpression } from 'typescript';

export const parametersToRecord = (
    names: string[],
    parameters: Expression[],
    factory: NodeFactory
): ObjectLiteralExpression => {
    return factory.createObjectLiteralExpression(
        names.map((name, index) =>
            factory.createPropertyAssignment(name, parameters[index])
        ),
        undefined
    );
};
