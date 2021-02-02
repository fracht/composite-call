const rimraf = require('rimraf');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

const {
    default: generateJSBundle,
    getOutputPath: getJSBundleOutPath,
} = require('./generateJSBundle');
const {
    default: generateDeclarations,
    getOutputPath: getDeclarationsOutPath,
} = require('./generateDeclarations');

const config = require('./config');

function logStep(index, description) {
    console.log(chalk.blue(`\nStep ${index}: `) + description);
}

function printEntrypoints(entrypoints, output, getOutputPath) {
    console.log();

    entrypoints.forEach(({ input }) => {
        console.log(
            `${chalk.cyan(input)} → ${chalk.green(
                getOutputPath(input, output)
            )}`
        );
    });

    console.log();
}

function getProgressBar(fileCount) {
    const progress = new cliProgress.SingleBar({
        format: `|${chalk.cyan('{bar}')}| {value}/{total} Files`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    progress.start(fileCount, 0);

    return progress;
}

function main(config) {
    logStep(1, `Deleting folder ${chalk.cyan(config.output)}`);

    rimraf.sync(config.output);

    logStep(2, 'Generating JavaScript bundle');

    printEntrypoints(config.entrypoints, config.output, getJSBundleOutPath);

    const progress = getProgressBar(config.entrypoints.length);

    generateJSBundle(config.entrypoints, config.output, () =>
        progress.increment()
    ).then(() => {
        progress.stop();

        logStep(3, 'Generating TypeScript declarations');

        printEntrypoints(
            config.entrypoints,
            config.output,
            getDeclarationsOutPath
        );

        progress.start(config.entrypoints.length);

        generateDeclarations(config.entrypoints, config.output, () =>
            progress.increment()
        );

        progress.stop();
    });
}

main(config);
