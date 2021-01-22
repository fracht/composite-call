import { CompositeCall } from './lib/CompositeCall';
import { AnyFunction } from './lib/typings';

export * from './lib';

export declare function compose<T extends AnyFunction>(
    fun: T,
    ...args: Parameters<T>
): CompositeCall<T>;
