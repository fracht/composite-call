import type {
    AnyFunction,
    CallInfo,
    CompositeCallSender,
    PathMap,
    UnpackPromise,
} from './typings';

export class CompositeCall<
    T extends AnyFunction,
    S extends Array<AnyFunction> = [T]
> {
    static requestSender: CompositeCallSender;

    private sequence: Array<CallInfo<AnyFunction>> = [];

    public constructor(
        fun: T,
        args: Parameters<T>,
        private readonly outPathMap: PathMap<UnpackPromise<ReturnType<T>>>
    ) {
        this.sequence.push({ arguments: args, name: fun.name });
    }

    public then = <K extends Array<AnyFunction>>(
        onfulfilled: (
            value: PathMap<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<AnyFunction, K>
    ): CompositeCall<T, [...S, ...K]> => {
        const compositeCall = onfulfilled(this.outPathMap);
        this.sequence.push(...compositeCall.getSequence());
        return (this as unknown) as CompositeCall<T, [...S, ...K]>;
    };

    public getSequence = (): Array<CallInfo<AnyFunction>> => {
        return this.sequence;
    };

    public call = (requestSender = CompositeCall.requestSender) => {
        return requestSender<S>((this.sequence as unknown) as S);
    };
}
