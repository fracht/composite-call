import { ARRAY_ITEM, PATH } from '../../src';
import { prefixAllValues } from '../../src/lib/prefixAllValues';

describe('prefixAllValues', () => {
    it('should prefix values', () => {
        const prefixed = prefixAllValues(
            {
                lol: ({
                    [ARRAY_ITEM]: {
                        [PATH]: 'lol.[__compositeCallArrayIndex]',
                        d: {
                            [PATH]: 'lol.[__compositeCallArrayIndex].d',
                        },
                    },
                } as unknown) as Array<{
                    [PATH]: string;
                    d: {
                        [PATH]: string;
                    };
                }>,
                b: { c: 'No prefix', [PATH]: 'PREFIX_ME!' },
            },
            'prefix'
        );
        expect(prefixed.b[PATH]).toBe('prefix.PREFIX_ME!');
        expect(prefixed.lol[0][PATH]).toBe('prefix.lol.0');
        expect(prefixed.lol[0].d[PATH]).toBe('prefix.lol.0.d');
    });
});
