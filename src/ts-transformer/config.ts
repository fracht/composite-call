import path from 'path';

export type TransformerConfig = {
    declarationsPath: string;
    composeFunctionPath: string;
    declarationName: string;
    composeFunctionName: string;
    pathSymbolName: string;
    modulePath: string;
};

export const config: TransformerConfig = {
    declarationsPath: path.join(__dirname, 'index.d.ts'),
    composeFunctionPath: path.join(__dirname, 'index.js'),
    declarationName: 'compose',
    composeFunctionName: '__compose',
    modulePath: 'composite-call',
    pathSymbolName: 'PATH',
};
