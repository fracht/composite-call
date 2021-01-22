import { compose } from '../dist';

describe('compose transformation', () => {
    it('should compose function', async () => {
        function testFn(a: string, b: string) {
            return { c: a + b };
        }

        const fn = jest.fn(() => {
            return compose(testFn, 'hello2', 'world2');
        });

        const composed = compose(testFn, 'hello', 'world');

        composed.then(fn);

        expect(fn).toBeCalledWith({
            c: expect.anything(),
        });

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: 'testFn',
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
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
            c: expect.anything(),
        });

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: 'testFn',
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
        });
    });

    it('should compose class method', async () => {
        class DummyClass {
            testFn(a: string, b: string) {
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
            c: expect.anything(),
        });

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: '', // impossible to get name automatically
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
        });
    });

    it('should compose class parameter arrow function', async () => {
        class DummyClass {
            testFn = (a: string, b: string): { c: string } => {
                return { c: a + b };
            };
        }

        const dummyInstance = new DummyClass();

        const fn = jest.fn(({ c }: { c: string }) => {
            return compose(dummyInstance.testFn, c, 'world2');
        });

        const composed = compose(dummyInstance.testFn, 'hello', 'world');

        composed.then(fn as any);

        expect(fn).toBeCalledWith({
            c: expect.anything(),
        });

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: '', // impossible to get name automatically
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
        });
    });
});

describe('complex transformations', () => {
    it('should compose arrow function', () => {
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

        const fn = jest.fn((out: any) => {
            return compose(testFn, out.c.arr.b.c, out.e.f);
        });

        const composed = compose(testFn, 'hello', 'world');

        composed.then(fn);

        expect(JSON.parse(composed.getJson()[1])).toStrictEqual({
            name: 'testFn',
            args: {
                a: null,
                b: null,
            },
            preExpr: [
                'args.setA(testFn.getC().getArr().getB().getC())',
                'args.setB(testFn.getE().getF())',
            ],
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

        const fn = jest.fn((out: any) => {
            return compose(testFn, out.c.arr.b.c, out.e.f);
        });

        const composed = compose(testFn, 'hello', 'world');

        composed.then(fn);

        expect(JSON.parse(composed.getJson()[1])).toStrictEqual({
            name: 'testFn',
            args: {
                a: null,
                b: null,
            },
            preExpr: [
                'args.setA(testFn.getC().getArr().getB().getC())',
                'args.setB(testFn.getE().getF())',
            ],
        });
    });
});
