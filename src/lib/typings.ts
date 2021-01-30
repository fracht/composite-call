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
export const ARRAY_ITEM = Symbol.for('composite-call-array-item');

export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

export type InnerPath = {
    [PATH]: string;
};

export type TupleToRecord<T> = {
    [K in keyof T]: T[K];
};

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
    parameters: TupleToRecord<Parameters<T>>;
};

export type PathArr<T extends Array<unknown>> = PathMap<T[0]> & InnerPath;

export type PathMap<T> = {
    [K in keyof T]: T[K] extends object
        ? T[K] extends Array<unknown>
            ? PathArr<T[K]>
            : PathMap<T> & InnerPath
        : InnerPath;
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
