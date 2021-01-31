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

function getProgressBar(chunks) {
    const progress = new cliProgress.SingleBar({
        format:
            '|' +
            chalk.cyan('{bar}') +
            '| {percentage}% | {value}/{total} Files',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    progress.start(chunks, 0);

    return progress;
}

function main(config) {
    logStep(1, 'Deleting folder');

    rimraf.sync(config.output);

    logStep(2, 'Generating JavaScript bundle');

    console.log();

    config.entrypoints.forEach(({ input }) => {
        console.log(
            `${chalk.cyan(input)} → ${chalk.green(
                getJSBundleOutPath(input, config.output)
            )}`
        );
    });

    console.log();

    const progress = getProgressBar(config.entrypoints.length);

    generateJSBundle(config.entrypoints, config.output, () =>
        progress.increment()
    ).then(() => {
        progress.stop();

        logStep(3, 'Generating TypeScript declarations');

        console.log();

        config.entrypoints.forEach(({ input }) => {
            console.log(
                `${chalk.cyan(input)} → ${chalk.green(
                    getDeclarationsOutPath(input, config.output)
                )}`
            );
        });

        console.log();

        progress.start(config.entrypoints.length);

        generateDeclarations(config.entrypoints, config.output, () =>
            progress.increment()
        );

        progress.stop();
    });
}

main(config);
