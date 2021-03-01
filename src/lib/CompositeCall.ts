import { pathMapBuilder } from './pathMapBuilder';
import { prepareSequence } from './prepareSequence';
import type {
    AnyFunction,
    CallInfo,
    CompositeCallSender,
    NormalTypeToPathType,
    NormalTypeToStrictPathType,
    UnpackPromise,
} from './typings';
import { uuid } from './uuid';

export class CompositeCall<
    T extends AnyFunction,
    S extends Array<AnyFunction> = [T]
> {
    static sendRequest: CompositeCallSender;

    protected readonly index: number;
    protected sequence: Array<CallInfo<AnyFunction>> = [];

    public constructor(
        protected readonly fun: T,
        parameters: NormalTypeToPathType<Parameters<T>>,
        parameterNames?: string[]
    ) {
        this.index = uuid();

        this.sequence.push({
            parameters,
            index: this.index,
            parameterNames,
            name: fun.name,
        });
    }

    protected fulfill = <K extends Array<AnyFunction>>(
        onfulfilled: (
            value: NormalTypeToStrictPathType<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<AnyFunction, K>
    ): CompositeCall<AnyFunction, K> => {
        return onfulfilled(pathMapBuilder(this.fun.name, this.index));
    };

    protected getPreparedSequence = () => prepareSequence(this.sequence);

    public then = <K extends Array<AnyFunction>>(
        onfulfilled: (
            value: NormalTypeToStrictPathType<UnpackPromise<ReturnType<T>>>
        ) => CompositeCall<AnyFunction, K>
    ): CompositeCall<T, [...S, ...K]> => {
        const compositeCall = this.fulfill(onfulfilled);
        this.sequence.push(...compositeCall.getSequence());
        return (this as unknown) as CompositeCall<T, [...S, ...K]>;
    };

    public getSequence = (): Array<CallInfo<AnyFunction>> => {
        return this.sequence;
    };

    public call = (sendRequest = CompositeCall.sendRequest) => {
        return sendRequest<S>(this.getPreparedSequence(), this.fun);
    };
}
