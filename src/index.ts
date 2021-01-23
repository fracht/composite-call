import { CompositeCall } from './lib/CompositeCall';
import type { AnyFunction } from './lib/typings';

export declare function compose<T extends AnyFunction>(
    fun: T,
    ...args: Parameters<T>
): CompositeCall<T>;

export * from './lib';
