declare const NumberBrand: unique symbol;
declare const StringBrand: unique symbol;
declare const BooleanBrand: unique symbol;
declare const DateBrand: unique symbol;
declare const SymbolBrand: unique symbol;

export type NumberPath = typeof NumberBrand;
export type StringPath = typeof StringBrand;
export type BooleanPath = typeof BooleanBrand;
export type DatePath = typeof DateBrand;
export type SymbolPath = typeof SymbolBrand;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export const PATH_IDENTIFIER = Symbol.for('composite-call-path');

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

export type Path = (string | symbol | number)[];

export type InnerPath = {
    index: number;
    name: string;
    path: Path;
};

export type CallInfo<T extends AnyFunction> = {
    name: string;
    index: number;
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
