import { prefixAllValues } from './prefixAllValues';
import type {
    AnyFunction,
    CallInfo,
    CompositeCallSender,
    NormalTypeToStrictPathType,
    PathMap,
    TupleToRecord,
    UnpackPromise,
} from './typings';

export class CompositeCall<
    T extends AnyFunction,
    S extends Array<AnyFunction> = [T]
> {
    static sendRequest: CompositeCallSender;

    private sequence: Array<CallInfo<AnyFunction>> = [];

    public constructor(
        private readonly fun: T,
        parameters: TupleToRecord<Parameters<T>>,
        private readonly outPathMap: PathMap<UnpackPromise<ReturnType<T>>>
    ) {
        this.sequence.push({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parameters: prefixAllValues(parameters, fun.name) as any,
            name: fun.name,
        });
    }

    public then = <K extends Array<AnyFunction>>(
        onfulfilled: (
            value: NormalTypeToStrictPathType<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<AnyFunction, K>
    ): CompositeCall<T, [...S, ...K]> => {
        const compositeCall = onfulfilled(
            (this.outPathMap as unknown) as NormalTypeToStrictPathType<
                UnpackPromise<ReturnType<T>>
            >
        );
        this.sequence.push(...compositeCall.getSequence());
        return (this as unknown) as CompositeCall<T, [...S, ...K]>;
    };

    public getSequence = (): Array<CallInfo<AnyFunction>> => {
        return this.sequence;
    };

    public call = (sendRequest = CompositeCall.sendRequest) => {
        return sendRequest<S>(this.sequence, this.fun);
    };
}
