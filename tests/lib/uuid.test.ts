import { uuid } from '../../src/lib/uuid';

const MAX_ITERATIONS = 100;

describe('uuid', () => {
    it('should each time return unique id', () => {
        const prev: number[] = [];

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const newUuid = uuid();
            expect(prev.includes(newUuid)).toBeFalsy();
            prev.push(newUuid);
        }
    });
});
