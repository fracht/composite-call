import { renameFunction } from './renameFunction';
import { AnyFunction } from '../typings';

export function rename(name?: string): MethodDecorator {
    const decorator = <T extends AnyFunction>(
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        const fn = descriptor.value;

        const propertyKeyString = propertyKey.toString();
        const className = target.constructor.name;

        descriptor.value = renameFunction<T>(
            fn!,
            name ?? `${className}.${propertyKeyString}`
        );
    };

    return decorator as MethodDecorator;
}
