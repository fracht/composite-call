import { PATH_IDENTIFIER } from '../../src';
import { pathMapBuilder } from '../../src/lib/pathMapBuilder';

describe('pathMapBuilder', () => {
    it('should build paths (without initial path)', () => {
        expect(
            (pathMapBuilder('test', 0) as any).hello[0].world[PATH_IDENTIFIER]
        ).toStrictEqual({
            index: 0,
            name: 'test',
            path: ['hello', '0', 'world'],
        });
        expect(
            (pathMapBuilder('qwe', 11) as any).hello['helloWorld'].world[
                PATH_IDENTIFIER
            ]
        ).toStrictEqual({
            index: 11,
            name: 'qwe',
            path: ['hello', 'helloWorld', 'world'],
        });
        expect(
            (pathMapBuilder('asdf', 88) as any)[0][1][111111].b[PATH_IDENTIFIER]
        ).toStrictEqual({
            index: 88,
            name: 'asdf',
            path: ['0', '1', '111111', 'b'],
        });
    });
    it('should contain only PATH_IDENTIFIER property', () => {
        expect(
            PATH_IDENTIFIER in (pathMapBuilder('hello', 0) as any).hello
        ).toBeTruthy();
    });
});
