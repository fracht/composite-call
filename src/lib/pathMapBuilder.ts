import {
    InnerPath,
    NormalTypeToStrictPathType,
    Path,
    PATH_IDENTIFIER,
    UnpackPromise,
} from './typings';

export const pathMapBuilder = <T>(
    name: string,
    index: number,
    path: Path = []
): NormalTypeToStrictPathType<UnpackPromise<T>> => {
    const normalPath =
        Array.isArray(path) || path === undefined ? path : [path];
    return new Proxy(
        {},
        {
            get: (
                _,
                innerPath
            ): InnerPath | NormalTypeToStrictPathType<UnpackPromise<T>> => {
                if (innerPath === PATH_IDENTIFIER) {
                    return { path: normalPath, index, name };
                } else {
                    return pathMapBuilder(name, index, [
                        ...normalPath,
                        innerPath,
                    ]);
                }
            },
            has: (_, innerPath) => innerPath === PATH_IDENTIFIER,
        }
    ) as NormalTypeToStrictPathType<UnpackPromise<T>>;
};
