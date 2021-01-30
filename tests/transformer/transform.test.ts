import { compose } from '../../dist';
import { StringPath } from '../../dist/lib/primitiveValueTypes';
import {
    NormalTypeToStrictPathType,
    UnpackPromise,
} from '../../dist/lib/typings';
import { PATH } from '../../src';
import { rename } from '../../src/utils';

describe('compose transformation', () => {
    it('should compose function', async () => {
        function testFn(a: string, b: string): { c: string } {
            return { c: a + b };
        }

        const fn = jest.fn(() => {
            return compose(testFn, 'hello2', 'world2');
        });

        const composed = compose(testFn, 'hello', 'world');

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
        const testFn = (a: string, b: string): { c: string } => {
            return { c: a + b };
        };

        const fn = jest.fn(() => {
            return compose(testFn, 'hello2', 'world2');
        });

        const composed = compose(testFn, 'hello', 'world');

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
            testFn(a: string, b: string): { c: string } {
                return { c: a + b };
            }
        }

        const dummyInstance = new DummyClass();

        const fn = jest.fn(() => {
            return compose(dummyInstance.testFn, 'hello2', 'world2');
        });

        const composed = compose(dummyInstance.testFn, 'hello', 'world');

        composed.then(fn);

        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });

        expect(composed.getSequence()[0]).toStrictEqual({
            name: '', // impossible to get name automatically
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });

    it('should compose class parameter arrow function', async () => {
        class DummyClass {
            testFn = (a: string, b: string): { c: string } => {
                return { c: a + b };
            };
        }

        const dummyInstance = new DummyClass();

        const fn = jest.fn(({ c }: { c: StringPath }) => {
            return compose(dummyInstance.testFn, c as any, 'world2');
        });

        const composed = compose(dummyInstance.testFn, 'hello', 'world');

        composed.then(fn);

        expect(fn).toBeCalledWith({
            c: {
                [PATH]: 'c',
            },
            [PATH]: '',
        });

        expect(composed.getSequence()[0]).toStrictEqual({
            name: '', // impossible to get name automatically
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
            c: { d: string; arr: { a: string; b: { c: number } }[] };
            e: { f: string };
        };

        const testFn = (
            a: string,
            b: string
        ): {
            c: { d: string; arr: { a: string; b: { c: number } }[] };
            e: { f: string };
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
                return compose(testFn, out.c.arr[0].b.c as any, out.e.f);
            }
        );

        const composed = compose(testFn, 'hello', 'world');

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

        const composed = compose(testFn, 'hello', 'world');

        composed.then((out) => compose(testFn, out.c.arr[0].a, 'hello'));

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
            ): Promise<{ c: { numb: number; hello: string } }> {
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
            ): Promise<{ c: number; asdf: string; b: Date | null }> {
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

        const [firstFind, firstSave, secondSave, secondFind] = await compose(
            service.find,
            1,
            'asdf'
        )
            .then((out) => compose(service.save, out.c.numb, out.c.hello, null))
            .then((out) =>
                compose(service.save, 15, out.c.hello, null).then((out) =>
                    compose(service.find, out.c, out.asdf)
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
