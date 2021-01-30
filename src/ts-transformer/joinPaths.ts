export const joinPaths = (...arr: (string | undefined | false)[]) =>
    arr.filter(Boolean).join('.');
