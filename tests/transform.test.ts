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
});
