// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export const PATH = Symbol();

export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

export type InnerPath = {
    [PATH]: string;
};

export type PathArr<T extends Array<unknown>> = PathMap<T[0]> & InnerPath;

export type PathMap<T> = {
    [K in keyof T]: T[K] extends object
        ? T[K] extends Array<unknown>
            ? PathArr<T[K]>
            : PathMap<T> & InnerPath
        : InnerPath;
};
