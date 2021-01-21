import { AnyFunction } from '../typings';

export const renameFunction = <T extends AnyFunction>(
    fun: T,
    name: string
): T => {
    Object.defineProperty(fun, 'name', { value: name });
    return fun;
};
