import { insertIndexes } from './insertIndexes';
import { ARRAY_ITEM, PATH } from './typings';

export const prefixAllValues = <T extends Object>(
    object: T,
    prefix: string,
    arrayIndexes: number[] = []
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
                return `${prefix}.${insertIndexes(
                    value as string,
                    arrayIndexes
                )}`;
            } else if (
                typeof name === 'number' ||
                (typeof name === 'string' && /^[0-9]+$/.test(name))
            ) {
                return prefixAllValues(
                    (target as Record<string, unknown>)[
                        (ARRAY_ITEM as unknown) as string
                    ] as object,
                    prefix,
                    [
                        ...arrayIndexes,
                        typeof name === 'string' ? parseInt(name) : name,
                    ]
                );
            } else if (typeof value === 'object' && value !== null) {
                return prefixAllValues(value, prefix, arrayIndexes);
            } else {
                return value;
            }
        },
    });
};
