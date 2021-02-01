import { CompositeCall } from './CompositeCall';
import type { AnyFunction, NormalTypeToPathType } from './typings';

export function compose<T extends AnyFunction>(
    fun: T,
    ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
    argNames: string[],
    fun: T,
    ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
    funOrNames: T | string[],
    funOrType: T | NormalTypeToPathType<Parameters<T>>[0],
    ...otherArgs: NormalTypeToPathType<Parameters<T>>
) {
    if (typeof funOrNames === 'function') {
        return new CompositeCall(funOrNames, [
            funOrType,
            ...otherArgs,
        ] as NormalTypeToPathType<Parameters<T>>);
    } else {
        return new CompositeCall(funOrType, otherArgs, funOrNames);
    }
}
