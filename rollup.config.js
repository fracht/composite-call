import typescript from 'rollup-plugin-typescript2';
import { parse } from 'path';

const createConfig = (input, exports) => {
    const name = parse(input).name;

    return {
        input,
        output: {
            file: `dist/${name}.js`,
            format: 'cjs',
            exports,
        },
        external: ['typescript', 'lodash/get', 'path'],
        plugins: [typescript({})],
    };
};

export default [
    createConfig('src/index.ts', 'named'),
    createConfig('src/utils.ts', 'named'),
    createConfig('src/transformer.ts', 'default'),
];
