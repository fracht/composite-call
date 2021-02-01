import get from 'lodash/get';

import type { AnyFunction, CallInfo } from './typings';
import { PATH } from './typings';

export const getExpressionsFromCall = ({
    parameters,
}: CallInfo<AnyFunction>): string[] => {
    const queue = [...Object.keys(parameters)];

    const preExpr: string[] = [];

    while (queue.length > 0) {
        const path = queue.shift()!;
        const arg = get(parameters, path);
        if (arg && arg[PATH]) {
            preExpr.push(arg[PATH]);
        } else if (typeof arg === 'object' && arg !== null) {
            const newKeys = Object.keys(arg);
            if (newKeys.length > 0) {
                queue.push(...newKeys.map((key) => `${path}.${key}`));
            }
        }
    }

    return preExpr;
};
