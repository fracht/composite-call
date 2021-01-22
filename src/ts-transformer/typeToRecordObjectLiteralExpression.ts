import {
    NodeFactory,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    Type,
    TypeChecker,
} from 'typescript';

import { isTypeInterfaceOrArray } from './isTypeInterfaceOrArray';
import { symbolToRecordObjectLiteralExpression } from './symbolToRecordObjectLiteralExpression';
import { Identifiers } from './typings';
import { unboxPromise } from './unboxPromise';

export const typeToRecordObjectLiteralExpression = (
    type: Type,
    typeChecker: TypeChecker,
    factory: NodeFactory,
    identifiers: Identifiers
): ObjectLiteralExpression => {
    type = unboxPromise(type, typeChecker);

    if (isTypeInterfaceOrArray(type, typeChecker)) {
        const parameters = typeChecker.getPropertiesOfType(type);

        const out: ObjectLiteralElementLike[] = [];

        parameters.forEach((symbol) =>
            out.push(
                factory.createPropertyAssignment(
                    symbol.getName(),
                    symbolToRecordObjectLiteralExpression(
                        symbol,
                        typeChecker,
                        factory,
                        identifiers
                    )
                )
            )
        );

        return factory.createObjectLiteralExpression(out);
    }

    return factory.createObjectLiteralExpression();
};
