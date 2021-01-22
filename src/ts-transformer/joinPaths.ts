export const joinPaths = (...arr: (string | undefined)[]) =>
    arr.filter(Boolean).join('.');
