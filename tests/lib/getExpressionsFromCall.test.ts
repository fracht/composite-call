import { getExpressionsFromCall, PATH_IDENTIFIER } from '../../src';

describe('getExpressionsFromCall', () => {
    it('should get expressions from call', () => {
        expect(
            getExpressionsFromCall({
                parameters: {
                    c: {
                        d: {
                            e: {
                                [PATH_IDENTIFIER]: ['hello', 'g', 'g', 'd'],
                            },
                        },
                    },
                } as any,
                name: 'hello',
            })
        ).toStrictEqual([
            {
                parameterPath: ['c', 'd', 'e'],
                sourcePath: ['hello', 'g', 'g', 'd'],
            },
        ]);
        expect(
            getExpressionsFromCall({
                parameters: [
                    {
                        c: {
                            d: {
                                e: {
                                    [PATH_IDENTIFIER]: ['hello', 'g', 'g', 'd'],
                                },
                            },
                        },
                    },
                ],
                name: 'hello',
            })
        ).toStrictEqual([
            {
                parameterPath: ['0', 'c', 'd', 'e'],
                sourcePath: ['hello', 'g', 'g', 'd'],
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
                                [PATH_IDENTIFIER]: ['hello', 'a', 'a', 'a'],
                            },
                        },
                    },
                    e: {
                        arr: [
                            {
                                d: {
                                    [PATH_IDENTIFIER]: ['hello', 'D', 'e', 'f'],
                                },
                            },
                        ],
                    },
                } as any,
                name: 'hello',
            })
        ).toStrictEqual([
            {
                parameterPath: ['c', 'd', 'e'],
                sourcePath: ['hello', 'a', 'a', 'a'],
            },
            {
                parameterPath: ['e', 'arr', '0', 'd'],
                sourcePath: ['hello', 'D', 'e', 'f'],
            },
        ]);
    });
});
