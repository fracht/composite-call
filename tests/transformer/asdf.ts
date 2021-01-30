const compositeCall_1 = require('composite-call');
import { StringPath } from '../../dist/lib/primitiveValueTypes';
import {
    NormalTypeToStrictPathType,
    UnpackPromise,
} from '../../dist/lib/typings';
import { PATH } from '../../src';
import { rename } from '../../src/utils';
describe('compose transformation', () => {
    it('should compose function', async () => {
        function testFn(
            a: string,
            b: string
        ): {
            c: string;
        } {
            return { c: a + b };
        }
        const fn = jest.fn(() => {
            return compositeCall_1.__compose(
                testFn,
                { a: 'hello2', b: 'world2' },
                {
                    [compositeCall_1.PATH]: '',
                    c: { [compositeCall_1.PATH]: 'c' },
                }
            );
        });
        const composed = compositeCall_1.__compose(
            testFn,
            { a: 'hello', b: 'world' },
            { [compositeCall_1.PATH]: '', c: { [compositeCall_1.PATH]: 'c' } }
        );
        composed.then(fn);
        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });
        expect(composed.getSequence()[0]).toStrictEqual({
            name: 'testFn',
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
    it('should compose arrow function', async () => {
        const testFn = (
            a: string,
            b: string
        ): {
            c: string;
        } => {
            return { c: a + b };
        };
        const fn = jest.fn(() => {
            return compositeCall_1.__compose(
                testFn,
                { a: 'hello2', b: 'world2' },
                {
                    [compositeCall_1.PATH]: '',
                    c: { [compositeCall_1.PATH]: 'c' },
                }
            );
        });
        const composed = compositeCall_1.__compose(
            testFn,
            { a: 'hello', b: 'world' },
            { [compositeCall_1.PATH]: '', c: { [compositeCall_1.PATH]: 'c' } }
        );
        composed.then(fn);
        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });
        expect(composed.getSequence()[0]).toStrictEqual({
            name: 'testFn',
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
    it('should compose class method', async () => {
        class DummyClass {
            testFn(
                a: string,
                b: string
            ): {
                c: string;
            } {
                return { c: a + b };
            }
        }
        const dummyInstance = new DummyClass();
        const fn = jest.fn(() => {
            return compositeCall_1.__compose(
                dummyInstance.testFn,
                { a: 'hello2', b: 'world2' },
                {
                    [compositeCall_1.PATH]: '',
                    c: { [compositeCall_1.PATH]: 'c' },
                }
            );
        });
        const composed = compositeCall_1.__compose(
            dummyInstance.testFn,
            { a: 'hello', b: 'world' },
            { [compositeCall_1.PATH]: '', c: { [compositeCall_1.PATH]: 'c' } }
        );
        composed.then(fn);
        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });
        expect(composed.getSequence()[0]).toStrictEqual({
            name: '',
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
    it('should compose class parameter arrow function', async () => {
        class DummyClass {
            testFn = (
                a: string,
                b: string
            ): {
                c: string;
            } => {
                return { c: a + b };
            };
        }
        const dummyInstance = new DummyClass();
        const fn = jest.fn(({ c }: { c: StringPath }) => {
            return compositeCall_1.__compose(
                dummyInstance.testFn,
                { a: c as any, b: 'world2' },
                {
                    [compositeCall_1.PATH]: '',
                    c: { [compositeCall_1.PATH]: 'c' },
                }
            );
        });
        const composed = compositeCall_1.__compose(
            dummyInstance.testFn,
            { a: 'hello', b: 'world' },
            { [compositeCall_1.PATH]: '', c: { [compositeCall_1.PATH]: 'c' } }
        );
        composed.then(fn);
        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });
        expect(composed.getSequence()[0]).toStrictEqual({
            name: '',
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
});
describe('complex transformations', () => {
    it('should compose arrow function', () => {
        type TestReturnType = {
            c: {
                d: string;
                arr: {
                    a: string;
                    b: {
                        c: number;
                    };
                }[];
            };
            e: {
                f: string;
            };
        };
        const testFn = (
            a: string,
            b: string
        ): {
            c: {
                d: string;
                arr: {
                    a: string;
                    b: {
                        c: number;
                    };
                }[];
            };
            e: {
                f: string;
            };
        } => {
            return {
                c: {
                    d: a,
                    arr: [
                        {
                            a: b,
                            b: {
                                c: 12,
                            },
                        },
                    ],
                },
                e: {
                    f: 'hello world!!!',
                },
            };
        };
        const fn = jest.fn(
            (
                out: NormalTypeToStrictPathType<UnpackPromise<TestReturnType>>
            ) => {
                return compositeCall_1.__compose(
                    testFn,
                    { a: out.c.arr[0].b.c as any, b: out.e.f },
                    {
                        [compositeCall_1.PATH]: '',
                        c: {
                            [compositeCall_1.PATH]: 'c',
                            d: { [compositeCall_1.PATH]: 'c.d' },
                            arr: {
                                [compositeCall_1.PATH]: 'c.arr',
                                [compositeCall_1.ARRAY_ITEM]: {
                                    [compositeCall_1.PATH]:
                                        'c.arr.[__compositeCallArrayIndex]',
                                    [compositeCall_1.ARRAY_ITEM]: {
                                        a: {
                                            [compositeCall_1.PATH]:
                                                'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex]',
                                        },
                                        b: {
                                            [compositeCall_1.PATH]:
                                                'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex]',
                                            c: {
                                                [compositeCall_1.PATH]:
                                                    'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex].c',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        e: {
                            [compositeCall_1.PATH]: 'e',
                            f: { [compositeCall_1.PATH]: 'e.f' },
                        },
                    }
                );
            }
        );

        const composed = compositeCall_1.__compose(
            testFn,
            { a: 'hello', b: 'world' },
            {
                [compositeCall_1.PATH]: '',
                c: {
                    [compositeCall_1.PATH]: 'c',
                    d: { [compositeCall_1.PATH]: 'c.d' },
                    arr: {
                        [compositeCall_1.PATH]: 'c.arr',
                        [compositeCall_1.ARRAY_ITEM]: {
                            [compositeCall_1.PATH]: 'c.arr.111111111',
                            [compositeCall_1.ARRAY_ITEM]: {
                                a: {
                                    [compositeCall_1.PATH]:
                                        'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex]',
                                },
                                b: {
                                    [compositeCall_1.PATH]:
                                        'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex]',
                                    c: {
                                        [compositeCall_1.PATH]:
                                            'c.arr.[__compositeCallArrayIndex].[__compositeCallArrayIndex].c',
                                    },
                                },
                            },
                        },
                    },
                },
                e: {
                    [compositeCall_1.PATH]: 'e',
                    f: { [compositeCall_1.PATH]: 'e.f' },
                },
            }
        );
        composed.then(fn);
        expect(composed.getSequence()[1]).toStrictEqual({
            name: 'testFn',
            parameters: {
                a: {
                    [PATH]: 'testFn.c.arr.b.c',
                },
                b: {
                    [PATH]: 'testFn.e.f',
                },
            },
        });
    });
    it('should compose arrow function (using interfaces)', () => {
        interface Arr {
            a: string;
            b: B[];
        }
        interface B {
            c: number;
        }
        interface C {
            d: string;
            arr: Arr[];
        }
        interface E {
            f: string;
        }
        interface TestReturn {
            c: C;
            e: E;
        }
        const testFn = (a: string, b: string): TestReturn => {
            return {
                c: {
                    d: a,
                    arr: [
                        {
                            a: b,
                            b: [
                                {
                                    c: 12,
                                },
                            ],
                        },
                    ],
                },
                e: {
                    f: 'hello world!!!',
                },
            };
        };
        const composed = compositeCall_1.__compose(
            testFn,
            { a: 'hello', b: 'world' },
            {
                [compositeCall_1.PATH]: '',
                c: {
                    [compositeCall_1.PATH]: 'c',
                    d: { [compositeCall_1.PATH]: 'c.d' },
                    arr: {
                        [compositeCall_1.PATH]: 'c.arr',
                        [compositeCall_1.ARRAY_ITEM]: {
                            [compositeCall_1.PATH]:
                                'c.arr.[__compositeCallArrayIndex]',
                        },
                    },
                },
                e: {
                    [compositeCall_1.PATH]: 'e',
                    f: { [compositeCall_1.PATH]: 'e.f' },
                },
            }
        );
        composed.then((out) =>
            compositeCall_1.__compose(
                testFn,
                { a: out.c.arr[0].a, b: 'hello' },
                {
                    [compositeCall_1.PATH]: '',
                    c: {
                        [compositeCall_1.PATH]: 'c',
                        d: { [compositeCall_1.PATH]: 'c.d' },
                        arr: {
                            [compositeCall_1.PATH]: 'c.arr',
                            [compositeCall_1.ARRAY_ITEM]: {
                                [compositeCall_1.PATH]:
                                    'c.arr.[__compositeCallArrayIndex]',
                            },
                        },
                    },
                    e: {
                        [compositeCall_1.PATH]: 'e',
                        f: { [compositeCall_1.PATH]: 'e.f' },
                    },
                }
            )
        );
        expect(composed.getSequence()[1]).toStrictEqual({
            name: 'testFn',
            parameters: {
                a: {
                    [PATH]: 'testFn.c.arr.b.c',
                },
                b: {
                    [PATH]: 'testFn.e.f',
                },
            },
        });
    });
});
describe('', () => {
    it('', async () => {
        class Test_service {
            @rename()
            find(
                numb: number,
                hello: string
            ): Promise<{
                c: {
                    numb: number;
                    hello: string;
                };
            }> {
                return Promise.resolve({
                    c: {
                        numb,
                        hello,
                    },
                });
            }
            @rename()
            save(
                c: number,
                asdf: string,
                b: Date | null
            ): Promise<{
                c: number;
                asdf: string;
                b: Date | null;
            }> {
                return Promise.resolve({
                    asdf,
                    b,
                    c,
                });
            }
        }
        const service = new Test_service();
        const r = {
            firstFind: {
                c: {
                    numb: 1,
                    hello: 'asdf',
                },
            },
            firstSave: {
                asdf: 'asdf',
                c: 1,
                b: null as Date | null,
            },
            secondSave: {
                asdf: 'asdf',
                c: 15,
                b: null as Date | null,
            },
            secondFind: {
                c: {
                    numb: 1,
                    hello: 'asdf',
                },
            },
        };
        const [
            firstFind,
            firstSave,
            secondSave,
            secondFind,
        ] = await compositeCall_1
            .__compose(
                service.find,
                { numb: 1, hello: 'asdf' },
                {
                    [compositeCall_1.PATH]: '',
                    c: {
                        [compositeCall_1.PATH]: 'c',
                        numb: { [compositeCall_1.PATH]: 'c.numb' },
                        hello: { [compositeCall_1.PATH]: 'c.hello' },
                    },
                }
            )
            .then((out) =>
                compositeCall_1.__compose(
                    service.save,
                    { c: out.c.numb, asdf: out.c.hello, b: null },
                    {
                        [compositeCall_1.PATH]: '',
                        c: { [compositeCall_1.PATH]: 'c' },
                        asdf: { [compositeCall_1.PATH]: 'asdf' },
                        b: { [compositeCall_1.PATH]: 'b' },
                    }
                )
            )
            .then((out) =>
                compositeCall_1
                    .__compose(
                        service.save,
                        { c: 15, asdf: out.c.hello, b: null },
                        {
                            [compositeCall_1.PATH]: '',
                            c: { [compositeCall_1.PATH]: 'c' },
                            asdf: { [compositeCall_1.PATH]: 'asdf' },
                            b: { [compositeCall_1.PATH]: 'b' },
                        }
                    )
                    .then((out) =>
                        compositeCall_1.__compose(
                            service.find,
                            { numb: out.c, hello: out.asdf },
                            {
                                [compositeCall_1.PATH]: '',
                                c: {
                                    [compositeCall_1.PATH]: 'c',
                                    numb: { [compositeCall_1.PATH]: 'c.numb' },
                                    hello: {
                                        [compositeCall_1.PATH]: 'c.hello',
                                    },
                                },
                            }
                        )
                    )
            )
            .call(() =>
                Promise.resolve([
                    r.firstFind,
                    r.firstSave,
                    r.secondSave,
                    r.secondFind,
                ] as any)
            );
        expect({ firstFind, firstSave, secondSave, secondFind }).toStrictEqual(
            r
        );
    });
});
