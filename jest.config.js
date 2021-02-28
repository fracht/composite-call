module.exports = {
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            babelConfig: true,
            compiler: 'ttypescript',
            tsconfig: './tsconfig.test.json',
        },
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    watchman: true,
    moduleNameMapper: {
        '^composite-call$': '../../dist',
    },
};
