import { renameFunction } from './renameFunction';
import { AnyFunction } from './typings';

const isAnyFunction = (fn: unknown): fn is AnyFunction =>
    typeof fn === 'function';

export function rename(name?: string): MethodDecorator {
    return <T>(
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        const fn = descriptor.value;

        const propertyKeyString = propertyKey.toString();
        const className = target.constructor.name;

        if (!isAnyFunction(fn)) {
            throw new Error(
                `Cannot decorate "${propertyKeyString}" of class "${className}". It is should be of function type`
            );
        }

        descriptor.value = renameFunction(
            fn,
            name ?? `${className}.${propertyKeyString}`
        );
    };
}
