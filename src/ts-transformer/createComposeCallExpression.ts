import { Expression, TransformationContext, TypeChecker } from 'typescript';

import type { ComposedFunctionData } from './getComposedFunctionData';
import { parametersToRecord } from './parametersToRecord';
import { typeToRecordObjectLiteralExpression } from './typeToRecordObjectLiteralExpression';
import { Identifiers } from './typings';

export const createComposeCallExpression = (
    [parameters, returnType]: ComposedFunctionData,
    identifiers: Identifiers,
    fun: Expression,
    funArguments: Expression[],
    context: TransformationContext,
    typeChecker: TypeChecker
) =>
    context.factory.createCallExpression(
        context.factory.createPropertyAccessExpression(
            identifiers.libName,
            identifiers.composeName
        ),
        undefined,
        [
            fun,
            parametersToRecord(parameters, funArguments, context.factory),
            typeToRecordObjectLiteralExpression(
                returnType,
                typeChecker,
                context.factory,
                identifiers
            ),
        ]
    );
