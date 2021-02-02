import { PATH_IDENTIFIER } from '../../src';
import { pathMapBuilder } from '../../src/lib/pathMapBuilder';

describe('pathMapBuilder', () => {
    it('should build paths (without initial path)', () => {
        expect(
            (pathMapBuilder() as any).hello[0].world[PATH_IDENTIFIER]
        ).toStrictEqual(['hello', '0', 'world']);
        expect(
            (pathMapBuilder() as any).hello['helloWorld'].world[PATH_IDENTIFIER]
        ).toStrictEqual(['hello', 'helloWorld', 'world']);
        expect(
            (pathMapBuilder() as any)[0][1][111111].b[PATH_IDENTIFIER]
        ).toStrictEqual(['0', '1', '111111', 'b']);
    });
    it('should build paths (with initial path)', () => {
        expect(
            (pathMapBuilder('initialPath') as any).hello[0].world[
                PATH_IDENTIFIER
            ]
        ).toStrictEqual(['initialPath', 'hello', '0', 'world']);
        expect(
            (pathMapBuilder('initialPath') as any).hello['helloWorld'].world[
                PATH_IDENTIFIER
            ]
        ).toStrictEqual(['initialPath', 'hello', 'helloWorld', 'world']);
        expect(
            (pathMapBuilder('initialPath') as any)[0][1][111111].b[
                PATH_IDENTIFIER
            ]
        ).toStrictEqual(['initialPath', '0', '1', '111111', 'b']);
    });
    it('should contain only PATH_IDENTIFIER property', () => {
        expect(PATH_IDENTIFIER in (pathMapBuilder() as any).hello).toBeTruthy();
    });
});
