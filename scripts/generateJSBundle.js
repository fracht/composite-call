const path = require('path');
const rollup = require('rollup');
const rollupPluginTypescript = require('rollup-plugin-typescript2');

function getOutputPath(input, outFolder) {
    return path.join(outFolder, `${path.parse(input).name}.js`);
}

function generateJSBundle(entrypoints, outFolder, increment) {
    return Promise.all(
        entrypoints.map(({ input, exports }) => {
            const output = getOutputPath(input, outFolder);

            return rollup
                .rollup({
                    input,
                    external: ['typescript', 'lodash/get', 'path'],
                    plugins: [rollupPluginTypescript({})],
                })
                .then((bundle) =>
                    bundle
                        .write({
                            file: output,
                            format: 'cjs',
                            exports,
                        })
                        .then(() => {
                            bundle.close();
                            increment();
                        })
                );
        })
    );
}

module.exports = {
    getOutputPath,
    default: generateJSBundle,
};
