import { CompositeCall, PATH_IDENTIFIER } from '../../src';

describe('CompositeCall', () => {
    it('should get sequence', () => {
        expect(
            new CompositeCall(
                function hello(a: string) {
                    return a;
                },
                ['asdf'],
                ['a']
            ).getSequence()
        ).toStrictEqual([
            {
                name: 'hello',
                index: 0,
                parameters: ['asdf'],
                parameterNames: ['a'],
            },
        ]);
        const sequence = new CompositeCall(
            function hello(a: string) {
                return { a };
            },
            ['asdf'],
            ['a']
        )
            .then(
                (output) =>
                    new CompositeCall(
                        function bye(a: string) {
                            return a;
                        },
                        [output.a],
                        ['a']
                    )
            )
            .getSequence();

        expect(sequence[0]).toStrictEqual({
            name: 'hello',
            index: expect.any(Number),
            parameters: ['asdf'],
            parameterNames: ['a'],
        });
        expect(sequence[1].parameters[0][PATH_IDENTIFIER]).toStrictEqual({
            index: expect.any(Number),
            name: 'hello',
            path: ['a'],
        });
        expect(
            sequence[0].index ===
                sequence[1].parameters[0][PATH_IDENTIFIER].index
        ).toBeTruthy();
    });
    it('should use custom caller', () => {
        const fun = (hello: string): { c: string } => ({ c: hello });

        const sender = jest.fn();

        new CompositeCall(fun, ['hello'], ['hello']).call(sender);

        expect(sender).toBeCalledWith(
            [
                {
                    name: 'fun',
                    index: 0,
                    parameters: ['hello'],
                    parameterNames: ['hello'],
                },
            ],
            fun
        );
    });
    it('should use static caller', () => {
        const fun = (hello: string): { c: string } => ({ c: hello });

        const sender = jest.fn();

        CompositeCall.sendRequest = sender;

        new CompositeCall(fun, ['hello'], ['hello']).call();

        expect(sender).toBeCalledWith(
            [
                {
                    name: 'fun',
                    index: 0,
                    parameters: ['hello'],
                    parameterNames: ['hello'],
                },
            ],
            fun
        );
    });
});
