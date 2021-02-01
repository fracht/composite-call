import { pathMapBuilder } from './pathMapBuilder';
import type {
    AnyFunction,
    CallInfo,
    CompositeCallSender,
    NormalTypeToPathType,
    NormalTypeToStrictPathType,
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
        parameters: NormalTypeToPathType<Parameters<T>>,
        parameterNames?: string[]
    ) {
        this.sequence.push({
            parameters,
            parameterNames,
            name: fun.name,
        });
    }

    public then = <K extends Array<AnyFunction>>(
        onfulfilled: (
            value: NormalTypeToStrictPathType<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<AnyFunction, K>
    ): CompositeCall<T, [...S, ...K]> => {
        const compositeCall = onfulfilled(pathMapBuilder(this.fun.name));
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
