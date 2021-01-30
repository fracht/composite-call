export const insertIndexes = (hello: string, indexes: number[]): string => {
    let index = 0;

    return hello.replace(
        /\[__compositeCallArrayIndex\]/g,
        () => `${indexes[index++]}`
    );
};
