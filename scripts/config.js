module.exports = {
    output: 'dist',
    entrypoints: [
        {
            input: 'src/index.ts',
            exports: 'named',
        },
        {
            input: 'src/utils.ts',
            exports: 'named',
        },
        {
            input: 'src/transformer.ts',
            exports: 'default',
        },
    ],
};
