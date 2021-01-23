import { CompositeCall } from './CompositeCall';
import type {
    AnyFunction,
    PathMap,
    TupleToRecord,
    UnpackPromise,
} from './typings';

export const __compose = <T extends AnyFunction>(
    fun: T,
    parameters: TupleToRecord<Parameters<T>>,
    outPathType: PathMap<UnpackPromise<ReturnType<T>>>
): CompositeCall<T> => {
    return new CompositeCall(fun, parameters, outPathType);
};
