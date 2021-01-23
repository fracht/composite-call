import { PATH } from '../../src';
import { prefixAllValues } from '../../src/lib/prefixAllValues';

describe('prefixAllValues', () => {
    it('should prefix values', () => {
        const prefixed = prefixAllValues(
            {
                lol: [{ [PATH]: 'lol' }],
                b: { c: 'No prefix', [PATH]: 'PREFIX_ME!' },
            },
            'prefix'
        );
        expect(prefixed.b[PATH]).toBe('prefix.PREFIX_ME!');
        expect(prefixed.lol[0][PATH]).toBe('prefix.lol');
    });
});
