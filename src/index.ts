import { CompositeCall } from './lib/CompositeCall';
import type { AnyFunction, NormalTypeToPathType } from './lib/typings';

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
        return new CompositeCall(funOrNames, ([
            funOrType,
            ...otherArgs,
        ] as unknown) as Parameters<T>);
    } else {
        return new CompositeCall(
            funOrType,
            otherArgs as Parameters<T>,
            funOrNames
        );
    }
}

export * from './lib';
