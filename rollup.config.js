import typescript from 'rollup-plugin-typescript2';
import { parse } from 'path';

const createConfig = (input, exports) => ({
    input,
    output: {
        file: `dist/${parse(input).name}.js`,
        format: 'cjs',
        exports,
    },
    plugins: [typescript({})],
});

export default [
    createConfig('src/index.ts', 'named'),
    createConfig('src/transformer.ts', 'default'),
];
