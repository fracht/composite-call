import path from 'path';

export type TransformerConfig = {
    declarationsPath: string;
    composeFunctionPath: string;
    declarationName: string;
    composeFunctionName: string;
    modulePath: string;
};

export const config: TransformerConfig = {
    declarationsPath: path.join(__dirname, 'composite-call.d.ts'),
    composeFunctionPath: path.join(__dirname, 'index.js'),
    declarationName: 'compose',
    composeFunctionName: 'compose',
    modulePath: 'composite-call',
};
