export const namedArrayToRecord = (arr: unknown[], names: string[]) =>
    arr.reduce<Record<string, unknown>>((acc, element, index) => {
        acc[names[index]] = element;
        return acc;
    }, {});
