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
    return new Proxy(
        {},
        {
            get: (
                _,
                innerPath
            ): InnerPath | NormalTypeToStrictPathType<UnpackPromise<T>> => {
                if (innerPath === PATH_IDENTIFIER) {
                    return { path: path, index, name };
                } else {
                    return pathMapBuilder(name, index, [...path, innerPath]);
                }
            },
            has: (_, innerPath) => innerPath === PATH_IDENTIFIER,
        }
    ) as NormalTypeToStrictPathType<UnpackPromise<T>>;
};
