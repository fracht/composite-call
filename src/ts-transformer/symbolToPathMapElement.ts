import { NodeFactory, Symbol } from 'typescript';

import { joinPaths } from './joinPaths';

export const symbolToPathMapElement = (
    symbol: Symbol,
    factory: NodeFactory,
    path: string | undefined
) => {
    const fullPath = joinPaths(path, symbol.getName());
    return factory.createPropertyAssignment(
        factory.createStringLiteral(fullPath),
        factory.createStringLiteral(fullPath)
    );
};
