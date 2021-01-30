import { CompositeCall } from './lib/CompositeCall';
import type { AnyFunction, NormalTypeToPathType } from './lib/typings';

export declare function compose<T extends AnyFunction>(
    fun: T,
    ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export * from './lib';
