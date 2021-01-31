import {
    BooleanPath,
    DatePath,
    NumberPath,
    StringPath,
    SymbolPath,
} from './primitiveValueTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export const PATH = Symbol.for('composite-call-path');

export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

export type CompositeCallSender = <T extends Array<AnyFunction>>(
    sequence: Array<CallInfo<AnyFunction>>,
    mainFun: AnyFunction
) => Promise<
    [
        ...{
            [K in keyof T]: T[K] extends AnyFunction
                ? UnpackPromise<ReturnType<T[K]>>
                : never;
        }
    ]
>;

export type CallInfo<T extends AnyFunction> = {
    name: string;
    parameters: Parameters<T>;
    parameterNames?: string[];
};

export type ValueToPath<T> = T extends boolean
    ? BooleanPath
    : T extends number
    ? NumberPath
    : T extends string
    ? StringPath
    : T extends Date
    ? DatePath
    : T extends Symbol
    ? SymbolPath
    : never;

export type NormalTypeToPathType<T> = T extends object
    ? {
          [K in keyof T]: NormalTypeToPathType<T[K]> | T[K];
      }
    : ValueToPath<T> | T;

export type NormalTypeToStrictPathType<T> = T extends object
    ? {
          [K in keyof T]: NormalTypeToStrictPathType<T[K]>;
      }
    : ValueToPath<T>;
