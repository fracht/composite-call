import {
    createPrinter,
    Program,
    SourceFile,
    TransformationContext,
    TransformerFactory,
} from 'typescript';

import { config } from './config';
import { visitNodeAndChildren } from './visitNodeAndChildren';
import { visitor } from './visitor';

export function transformer(program: Program): TransformerFactory<SourceFile> {
    return (context: TransformationContext) => (file: SourceFile) => {
        const libName = context.factory.createUniqueName('compositeCall');
        const composeName = context.factory.createIdentifier(
            config.composeFunctionName
        );
        const pathSymbolName = context.factory.createIdentifier(
            config.pathSymbolName
        );
        const transformedFile = visitNodeAndChildren(
            file,
            program,
            context,
            {
                libName,
                composeName,
                pathSymbolName,
            },
            visitor,
            config
        );
        return transformedFile;
    };
}
