import { compose } from '../dist';
import { rename } from '../src';

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

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: 'DummyClass.testFn',
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
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

        expect(JSON.parse(composed.getJson()[0])).toStrictEqual({
            name: "I'm custom name!!!",
            args: {
                a: 'hello',
                b: 'world',
            },
            preExpr: [],
        });
    });
});
