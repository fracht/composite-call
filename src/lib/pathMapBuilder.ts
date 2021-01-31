import { NormalTypeToStrictPathType, PATH, UnpackPromise } from './typings';

export const pathMapBuilder = <T>(
    path?: string
): NormalTypeToStrictPathType<UnpackPromise<T>> => {
    return new Proxy(
        {},
        {
            get: (_, innerPath) => {
                if (innerPath === PATH) {
                    return path;
                } else {
                    return pathMapBuilder(
                        [path, innerPath]
                            .filter((value) => value !== undefined)
                            .join('.')
                    );
                }
            },
            has: (_, innerPath) => innerPath === PATH,
        }
    ) as NormalTypeToStrictPathType<UnpackPromise<T>>;
};
