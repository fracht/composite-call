import { deepReplaceIndexes } from './deepReplaceIndexes';
import { AnyFunction, CallInfo } from './typings';

export const prepareSequence = (
    sequence: Array<CallInfo<AnyFunction>>
): Array<CallInfo<AnyFunction>> => {
    const indexMap: Record<string, number[]> = {};

    const newSequence = sequence.map((callInfo) => {
        const newCallInfo = { ...callInfo };

        if (callInfo.name in indexMap) {
            if (indexMap[callInfo.name].includes(callInfo.index)) {
                newCallInfo.index = indexMap[callInfo.name].indexOf(
                    callInfo.index
                );
            } else {
                newCallInfo.index = indexMap[callInfo.name].length;
                indexMap[callInfo.name].push(callInfo.index);
            }
        } else {
            indexMap[callInfo.name] = [callInfo.index];
            newCallInfo.index = 0;
        }

        return newCallInfo;
    });

    const functionIndexes: Array<{
        name: string;
        oldIndex: number;
        newIndex: number;
    }> = [];

    Object.entries(indexMap).forEach(([name, indexes]) => {
        indexes.forEach((oldIndex, newIndex) =>
            functionIndexes.push({ name, oldIndex, newIndex })
        );
    });

    return newSequence.map((callInfo) => {
        callInfo.parameters = deepReplaceIndexes(
            callInfo.parameters,
            functionIndexes
        );

        return callInfo;
    });
};
