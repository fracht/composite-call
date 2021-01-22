import { callToJson } from './index';
import { AnyFunction, PathMap, UnpackPromise } from './typings';

export class CompositeCall<T extends AnyFunction> {
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
