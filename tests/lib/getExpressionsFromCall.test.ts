import { PATH } from '../../src';
import { getExpressionsFromCall } from '../../src/utils';

describe('getExpressionsFromCall', () => {
    it('should get expressions from call', () => {
        expect(
            getExpressionsFromCall({
                parameters: {
                    c: {
                        d: {
                            e: {
                                [PATH]: 'hello.c.d.e',
                            },
                        },
                    },
                } as any,
                name: 'hello',
            })
        ).toStrictEqual(['hello.c.d.e']);
    });
    it('should get multiple expressions from call', () => {
        expect(
            getExpressionsFromCall({
                parameters: {
                    c: {
                        d: {
                            e: {
                                [PATH]: 'hello.c.d.e',
                            },
                        },
                    },
                    e: {
                        arr: [
                            {
                                d: {
                                    [PATH]: 'hello.e.arr.d',
                                },
                            },
                        ],
                    },
                } as any,
                name: 'hello',
            })
        ).toStrictEqual(['hello.c.d.e', 'hello.e.arr.d']);
    });
});
