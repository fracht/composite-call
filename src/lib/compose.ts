import { CompositeCall } from './CompositeCall';
import type { AnyFunction, NormalTypeToPathType } from './typings';

export function compose<T extends AnyFunction>(
    fun: T,
    ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
    parameterNames: string[],
    fun: T,
    ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
    funOrNames: T | string[],
    ...args: NormalTypeToPathType<Parameters<T>>
) {
    const funOrType: T | NormalTypeToPathType<Parameters<T>>[0] = args[0];
    const [, ...otherArgs] = args;
    if (typeof funOrNames === 'function') {
        return new CompositeCall(funOrNames, args);
    } else {
        return new CompositeCall(
            funOrType,
            otherArgs as NormalTypeToPathType<Parameters<T>>,
            funOrNames
        );
    }
}
