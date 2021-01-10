import { compose } from '../../dist';

function func(a: number, b: string) {
    return {
        a,
        d: {
            c: b,
        },
    };
}

console.log(compose(func, 0, 'asdf').call());
