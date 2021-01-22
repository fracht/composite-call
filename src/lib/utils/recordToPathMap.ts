import set from 'lodash/set';
import toPath from 'lodash/toPath';

import { PATH, PathMap } from '../typings';

export const recordToPathMap = <T>(
    record: Record<string, string>
): PathMap<T> => {
    const pathMap = {};

    Object.keys(record).map((key) => {
        const path: (string | symbol)[] = toPath(key);
        path.push(PATH);
        set(pathMap, path, key);
    });

    return pathMap as PathMap<T>;
};
