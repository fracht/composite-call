import { compose } from '../../dist';
import { rename } from '../../src/utils';

describe('renameDecorator', () => {
    it('should rename class method', async () => {
        class DummyClass {
            @rename()
            testFn(a: string, b: string) {
                return { c: a + b };
            }
        }

        const dummyInstance = new DummyClass();

        const composed = compose(dummyInstance.testFn, 'hello', 'world');

        expect(composed.getSequence()[0]).toStrictEqual({
            name: 'DummyClass.testFn',
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
    it('should rename class method with custom specified name', async () => {
        class DummyClass {
            @rename("I'm custom name!!!")
            testFn(a: string, b: string) {
                return { c: a + b };
            }
        }

        const dummyInstance = new DummyClass();

        const composed = compose(dummyInstance.testFn, 'hello', 'world');

        expect(composed.getSequence()[0]).toStrictEqual({
            name: "I'm custom name!!!",
            parameters: {
                a: 'hello',
                b: 'world',
            },
        });
    });
    it('should throw an error', async () => {
        expect(() => {
            class DummyClass {
                @(rename('I will throw!!!') as PropertyDecorator)
                testFn = undefined;
            }

            const dummyInstance = new DummyClass();
            dummyInstance.testFn = undefined;
        }).toThrow();
    });
});
