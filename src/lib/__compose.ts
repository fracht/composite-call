import { namedArrayToRecord } from './utils/namedArrayToRecord';
import { recordToPathMap } from './utils/recordToPathMap';
import { CompositeCall } from './CompositeCall';
import type { AnyFunction } from './typings';

export const __compose = <T extends AnyFunction>(
    fun: T,
    argNames: string[],
    retTypeMap: Record<string, string>,
    ...args: Parameters<T>
): CompositeCall<T> => {
    return new CompositeCall(
        fun,
        (namedArrayToRecord(args, argNames) as unknown) as Parameters<T>,
        recordToPathMap(retTypeMap)
    );
};
