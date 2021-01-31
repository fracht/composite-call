const generateDtsBundle = require('dts-bundle-generator').generateDtsBundle;
const path = require('path');
const fs = require('fs');

function getOutputPath(input, outDir) {
    return path.join(outDir, `${path.parse(input).name}.d.ts`);
}

function generateDeclarations(entrypoints, outDir, increment) {
    generateDtsBundle(
        entrypoints.map(({ input }) => ({
            filePath: input,
        })),
        {
            preferredConfigPath: 'tsconfig.json',
        }
    ).map((text, index) => {
        fs.writeFileSync(getOutputPath(entrypoints[index].input, outDir), text);
        increment();
    });
}

module.exports = {
    default: generateDeclarations,
    getOutputPath,
};
