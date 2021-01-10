const path = require('path');
const compositeCallTransformer = require('composite-call/dist/transformer')
    .default;

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: `index.bundle.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: (program) => ({
                        before: [compositeCallTransformer(program)],
                    }),
                },
            },
        ],
    },
};
