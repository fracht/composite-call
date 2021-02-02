import {
    NormalTypeToStrictPathType,
    PATH_IDENTIFIER,
    UnpackPromise,
} from './typings';

export const pathMapBuilder = <T>(
    path: string | symbol | number | (string | symbol | number)[] = []
): NormalTypeToStrictPathType<UnpackPromise<T>> => {
    const normalPath =
        Array.isArray(path) || path === undefined ? path : [path];
    return new Proxy(
        {},
        {
            get: (_, innerPath) => {
                if (innerPath === PATH_IDENTIFIER) {
                    return normalPath;
                } else {
                    return pathMapBuilder([...normalPath, innerPath]);
                }
            },
            has: (_, innerPath) => innerPath === PATH_IDENTIFIER,
        }
    ) as NormalTypeToStrictPathType<UnpackPromise<T>>;
};
