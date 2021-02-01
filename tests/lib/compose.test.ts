import { compose } from '../../src';

describe('compose', () => {
    it('should compose without parameter names', () => {
        expect(
            compose(function fun() {
                /** empty */
            }).getSequence()
        ).toStrictEqual([
            {
                name: 'fun',
                parameters: [],
                parameterNames: undefined,
            },
        ]);
        expect(
            compose(function fun(arg1: number) {
                return arg1;
            }, 0).getSequence()
        ).toStrictEqual([
            {
                name: 'fun',
                parameters: [0],
                parameterNames: undefined,
            },
        ]);
    });
    it('should compose with parameter names', () => {
        expect(
            compose([], function fun() {
                /** empty */
            }).getSequence()
        ).toStrictEqual([
            {
                name: 'fun',
                parameters: [],
                parameterNames: [],
            },
        ]);
        expect(
            compose(
                ['arg1'],
                function fun(arg1: number) {
                    return arg1;
                },
                0
            ).getSequence()
        ).toStrictEqual([
            {
                name: 'fun',
                parameters: [0],
                parameterNames: ['arg1'],
            },
        ]);
    });
});
