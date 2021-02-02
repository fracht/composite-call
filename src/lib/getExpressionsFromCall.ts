import type { AnyFunction, CallInfo, Path } from './typings';
import { PATH_IDENTIFIER } from './typings';

type QueueMember = {
    path: Path;
    obj: unknown;
};

export type ParameterExpression = {
    parameterPath: Path;
    sourcePath: Path;
};

export const getExpressionsFromCall = ({
    parameters,
}: CallInfo<AnyFunction>): ParameterExpression[] => {
    const expr: ParameterExpression[] = [];

    const queue: QueueMember[] = [{ path: [], obj: parameters }];

    while (queue.length > 0) {
        const { path, obj } = queue.shift()!;

        if (typeof obj === 'object' && obj !== null) {
            if (PATH_IDENTIFIER in obj) {
                expr.push({
                    parameterPath: path,
                    sourcePath: (obj as { [PATH_IDENTIFIER]: Path })[
                        PATH_IDENTIFIER
                    ],
                });
            } else {
                queue.push(
                    ...Object.keys(obj).map((innerPath) => ({
                        path: [...path, innerPath],
                        obj: (obj as Record<string, unknown>)[innerPath],
                    }))
                );
            }
        }
    }

    return expr;
};
