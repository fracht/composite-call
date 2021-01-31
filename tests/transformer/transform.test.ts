import { compose } from '../../dist';
import { StringPath } from '../../src/lib/primitiveValueTypes';

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

        expect(composed.getSequence()[0]).toStrictEqual({
            name: 'testFn',
            parameterNames: ['a', 'b'],
            parameters: ['hello', 'world'],
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

        expect(composed.getSequence()[0]).toStrictEqual({
            name: 'testFn',
            parameterNames: ['a', 'b'],
            parameters: ['hello', 'world'],
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
        expect(composed.getSequence()[0]).toStrictEqual({
            name: '', // impossible to get name automatically
            parameterNames: ['a', 'b'],
            parameters: ['hello', 'world'],
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

        composed.then(fn as any);

        expect(composed.getSequence()[0]).toStrictEqual({
            name: '', // impossible to get name automatically
            parameterNames: ['a', 'b'],
            parameters: ['hello', 'world'],
        });
    });
});
