import typescript from 'rollup-plugin-typescript2';
import { parse } from 'path';

const createConfig = (input) => ({
    input,
    output: {
        file: `dist/${parse(input).name}.js`,
        format: 'cjs',
    },
    plugins: [typescript({})],
});

export default [
    createConfig('src/index.ts'),
    createConfig('src/transformer.ts'),
];
