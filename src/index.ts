import get from 'lodash/get';
import set from 'lodash/set';
import toPath from 'lodash/toPath';

const GET_NAME_SYMBOL = Symbol();

type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type InnerPath = {
    [GET_NAME_SYMBOL]: () => string;
};

type PathArr<T extends Array<unknown>> = PathMap<T[0]> & InnerPath;

type PathMap<T> = {
    [K in keyof T]: T[K] extends object
        ? T[K] extends Array<unknown>
            ? PathArr<T[K]>
            : PathMap<T> & InnerPath
        : InnerPath;
};

const capitalize = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

const pathToExpr = (keyFrom: string, keyTo: string, funName: string) => {
    const segmentsTo = toPath(keyTo);

    let expr = 'args';

    for (let i = 0; i < segmentsTo.length; i++) {
        if (i === segmentsTo.length - 1) {
            expr += `.set${capitalize(segmentsTo[i])}(${funName}`;
        } else {
            expr += `.get${capitalize(segmentsTo[i])}()`;
        }
    }

    const segmentsFrom = toPath(keyFrom);

    for (let i = 0; i < segmentsFrom.length; i++) {
        expr += `.get${capitalize(segmentsFrom[i])}()`;
    }

    return expr + ')';
};

export const callToJson = <T>(args: T, name: string) => {
    const queue: string[] = [...Object.keys(args)];

    const normalArgs: Partial<T> = {};

    const preExpr = [];

    while (queue.length > 0) {
        const path = queue.shift()!;
        const arg = get(args, path);
        if (arg && arg[GET_NAME_SYMBOL]) {
            set(normalArgs, path, null);
            preExpr.push(pathToExpr(arg[GET_NAME_SYMBOL](), path, name));
        } else {
            set(normalArgs, path, arg);
            if (typeof arg === 'object' && arg !== null) {
                const newKeys = Object.keys(arg);
                if (newKeys.length > 0) {
                    queue.push(...newKeys.map((key) => `${path}.${key}`));
                }
            }
        }
    }

    return JSON.stringify({
        name,
        args: normalArgs,
        preExpr,
    });
};

export class CompositeCall<T extends (...args: any[]) => any> {
    private sequence: string[] = [];

    public constructor(
        fun: T,
        args: Parameters<T>,
        private readonly outPathMap: PathMap<UnpackPromise<ReturnType<T>>>
    ) {
        this.sequence.push(callToJson(args, fun.name));
    }

    public then = (
        onfulfilled: (
            value: PathMap<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<any>
    ): CompositeCall<T> => {
        const compositeCall = onfulfilled(this.outPathMap);
        this.sequence.push(...compositeCall.getJson());
        return this;
    };

    public getJson = (): string[] => {
        return this.sequence;
    };

    public call = (): string => {
        return JSON.stringify(
            {
                seq: this.sequence.map((value) => JSON.parse(value)),
            },
            null,
            4
        );
    };
}

/**
 * compose(find_documents, id, hello, bye).then(() => compose())
 */

export const recordToPathMap = <T>(
    record: Record<string, string>
): PathMap<T> => {
    const pathMap = {};

    Object.keys(record).map((key) => {
        const path: (string | symbol)[] = toPath(key);
        path.push(GET_NAME_SYMBOL);
        set(pathMap, path, () => key);
    });

    return pathMap as PathMap<T>;
};

const argsToMap = (args: unknown[], names: string[]) =>
    args.reduce<Record<string, unknown>>((map, arg, index) => {
        map[names[index]] = arg;
        return map;
    }, {});

export declare function compose<T extends (...args: any[]) => any>(
    fun: T,
    ...args: Parameters<T>
): CompositeCall<T>;

export const __compose__ = <T extends (...args: any[]) => any>(
    fun: T,
    argNames: string[],
    retTypeMap: Record<string, string>,
    ...args: Parameters<T>
): CompositeCall<T> => {
    return new CompositeCall(
        fun,
        (argsToMap(args, argNames) as unknown) as Parameters<T>,
        recordToPathMap(retTypeMap)
    );
};
