import { InnerPath, PATH_IDENTIFIER } from './typings';

type QueueMember = {
    ref: Record<string | typeof PATH_IDENTIFIER, unknown>;
    entries: [string | typeof PATH_IDENTIFIER, unknown][];
};

const createRef = (example: unknown) =>
    (Array.isArray(example) ? [] : {}) as Record<
        string | typeof PATH_IDENTIFIER,
        unknown
    >;

const getEntries = (object: object) => {
    const entries: QueueMember['entries'] = Object.entries(object);

    if (PATH_IDENTIFIER in object) {
        entries.push([
            PATH_IDENTIFIER,
            (object as QueueMember['ref'])[PATH_IDENTIFIER],
        ]);
    }

    return entries;
};

export const deepReplaceIndexes = <T>(
    parameters: T,
    functions: Array<{
        name: string;
        oldIndex: number;
        newIndex: number;
    }>
): T => {
    if (typeof parameters !== 'object' || parameters === null)
        return parameters;

    const newParameters = createRef(parameters);

    const queue: QueueMember[] = [
        {
            ref: newParameters,
            entries: getEntries((parameters as unknown) as object),
        },
    ];

    while (queue.length > 0) {
        const { ref, entries } = queue.shift()!;

        for (const [key, value] of entries) {
            if (
                typeof value === 'object' &&
                value !== null &&
                (Object.keys(value).length > 0 || PATH_IDENTIFIER in value)
            ) {
                if (key === PATH_IDENTIFIER) {
                    const innerPath: InnerPath = {
                        ...(value as InnerPath),
                    };

                    const foundIndex = functions.findIndex(
                        ({ name, oldIndex }) =>
                            innerPath.name === name &&
                            innerPath.index === oldIndex
                    );

                    if (foundIndex !== -1) {
                        innerPath.index = functions[foundIndex].newIndex;
                    }

                    ref[PATH_IDENTIFIER] = innerPath;
                } else {
                    const newRef = createRef(value);

                    ref[key] = newRef;

                    const entries = getEntries(value);

                    queue.push({
                        ref: newRef,
                        entries,
                    });
                }
            } else {
                ref[key] = value;
            }
        }
    }

    return newParameters as T;
};
