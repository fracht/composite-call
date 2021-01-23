import { PATH } from './typings';

export const prefixAllValues = <T extends Object>(
    object: T,
    prefix: string
): T => {
    return new Proxy(object, {
        get: (target, name) => {
            const value =
                name in target
                    ? (target as Record<string | symbol | number, unknown>)[
                          name as string | number
                      ]
                    : undefined;

            if (name === PATH) {
                return `${prefix}.${value}`;
            } else if (typeof value === 'object' && value !== null) {
                return prefixAllValues(value, prefix);
            } else {
                return value;
            }
        },
    });
};
