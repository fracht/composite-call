import { CompositeCall } from './CompositeCall';
import type { AnyFunction, PathMap, UnpackPromise } from './typings';

export const __compose = <T extends AnyFunction>(
    fun: T,
    args: Record<string, unknown>,
    outPathType: PathMap<UnpackPromise<ReturnType<T>>>
): CompositeCall<T> => {
    return new CompositeCall(
        fun,
        (args as unknown) as Parameters<T>,
        outPathType
    );
};
