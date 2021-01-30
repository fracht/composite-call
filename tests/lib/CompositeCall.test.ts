import { PATH } from '../../src';
import { CompositeCall } from '../../src/utils';

describe('CompositeCall', () => {
    it('should use custom caller', () => {
        const fun = (hello: string): { c: string } => ({ c: hello });

        const sender = jest.fn();

        new CompositeCall(
            fun,
            ({ hello: 'hello' } as unknown) as Parameters<typeof fun>,
            {
                c: {
                    [PATH]: 'c',
                },
            }
        ).call(sender);

        expect(sender).toBeCalledWith(
            [
                {
                    name: 'fun',
                    parameters: {
                        hello: 'hello',
                    },
                },
            ],
            fun
        );
    });
});