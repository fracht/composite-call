import { pathMapBuilder } from '../../src/lib/pathMapBuilder';
import { PATH } from '../../src/lib/typings';

describe('pathMapBuilder', () => {
    it('should build paths (without initial path)', () => {
        expect((pathMapBuilder() as any).hello[0].world[PATH]).toBe(
            'hello.0.world'
        );
        expect((pathMapBuilder() as any).hello['helloWorld'].world[PATH]).toBe(
            'hello.helloWorld.world'
        );
        expect((pathMapBuilder() as any)[0][1][111111].b[PATH]).toBe(
            '0.1.111111.b'
        );
    });
    it('should build paths (with initial path)', () => {
        expect(
            (pathMapBuilder('initialPath') as any).hello[0].world[PATH]
        ).toBe('initialPath.hello.0.world');
        expect(
            (pathMapBuilder('initialPath') as any).hello['helloWorld'].world[
                PATH
            ]
        ).toBe('initialPath.hello.helloWorld.world');
        expect(
            (pathMapBuilder('initialPath') as any)[0][1][111111].b[PATH]
        ).toBe('initialPath.0.1.111111.b');
    });
});
