import { getExpressionsFromCall, PATH_IDENTIFIER } from '../../src';

describe('getExpressionsFromCall', () => {
    it('should get expressions from call', () => {
        expect(
            getExpressionsFromCall({
                parameters: {
                    c: {
                        d: {
                            e: {
                                [PATH_IDENTIFIER]: {
                                    name: 'hello',
                                    index: 0,
                                    path: ['hello', 'g', 'g', 'd'],
                                },
                            },
                            d: 'asdf',
                            g: null,
                        },
                    },
                } as any,
                index: 0,
                name: 'hello',
            })
        ).toStrictEqual([
            {
                sourcePath: {
                    name: 'hello',
                    index: 0,
                    path: ['hello', 'g', 'g', 'd'],
                },
                parameterPath: ['c', 'd', 'e'],
            },
        ]);
        expect(
            getExpressionsFromCall({
                parameters: [
                    {
                        c: {
                            d: {
                                str: [
                                    [],
                                    [[[], null], 0, [['asdf', new Date()]]],
                                ],
                                e: {
                                    [PATH_IDENTIFIER]: {
                                        path: ['hello', 'g', 'g', 'd'],
                                        name: 'basdf',
                                        index: 0,
                                    },
                                },
                            },
                        },
                    },
                ],
                index: 0,
                name: 'hello',
            })
        ).toStrictEqual([
            {
                sourcePath: {
                    path: ['hello', 'g', 'g', 'd'],
                    name: 'basdf',
                    index: 0,
                },
                parameterPath: ['0', 'c', 'd', 'e'],
            },
        ]);
    });
    it('should get multiple expressions from call', () => {
        expect(
            getExpressionsFromCall({
                parameters: {
                    c: {
                        d: {
                            e: {
                                [PATH_IDENTIFIER]: {
                                    name: 'b',
                                    index: 1,
                                    path: ['hello', 'a', 'a', 'a'],
                                },
                            },
                        },
                    },
                    e: {
                        arr: [
                            null,
                            'asdf',
                            {
                                d: {
                                    [PATH_IDENTIFIER]: {
                                        name: 'c',
                                        index: 2,
                                        path: ['hello', 'D', 'e', 'f'],
                                    },
                                },
                            },
                        ],
                    },
                } as any,
                name: 'hello',
                index: 0,
            })
        ).toStrictEqual([
            {
                sourcePath: {
                    name: 'b',
                    index: 1,
                    path: ['hello', 'a', 'a', 'a'],
                },
                parameterPath: ['c', 'd', 'e'],
            },
            {
                sourcePath: {
                    name: 'c',
                    index: 2,
                    path: ['hello', 'D', 'e', 'f'],
                },
                parameterPath: ['e', 'arr', '2', 'd'],
            },
        ]);
    });
});
