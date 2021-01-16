module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.(test|spec).ts'],
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
        'composite-call': '../dist/index.js',
    },
};
