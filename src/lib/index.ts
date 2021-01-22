import get from 'lodash/get';
import set from 'lodash/set';
import toPath from 'lodash/toPath';

import { PATH } from './typings';

export * from './utils/renameFunction';
export * from './utils/renameDecorator';
export * from './__compose';

const capitalize = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

const pathToExpr = (keyFrom: string, keyTo: string, funName: string) => {
    const segmentsTo = toPath(keyTo);

    let expr = 'args';

    for (let i = 0; i < segmentsTo.length; i++) {
        if (i === segmentsTo.length - 1) {
            expr += `.set${capitalize(segmentsTo[i])}(${funName}`;
        } else {
            expr += `.get${capitalize(segmentsTo[i])}()`;
        }
    }

    const segmentsFrom = toPath(keyFrom);

    for (let i = 0; i < segmentsFrom.length; i++) {
        expr += `.get${capitalize(segmentsFrom[i])}()`;
    }

    return expr + ')';
};

export const callToJson = <T>(args: T, name: string) => {
    const queue: string[] = [...Object.keys(args)];

    const normalArgs: Partial<T> = {};

    const preExpr = [];

    while (queue.length > 0) {
        const path = queue.shift()!;
        const arg = get(args, path);
        if (arg && arg[PATH]) {
            set(normalArgs, path, null);
            preExpr.push(pathToExpr(arg[PATH], path, name));
        } else {
            set(normalArgs, path, arg);
            if (typeof arg === 'object' && arg !== null) {
                const newKeys = Object.keys(arg);
                if (newKeys.length > 0) {
                    queue.push(...newKeys.map((key) => `${path}.${key}`));
                }
            }
        }
    }

    return JSON.stringify({
        name,
        args: normalArgs,
        preExpr,
    });
};
