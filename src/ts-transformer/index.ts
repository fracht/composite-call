import ts from 'typescript';

import { config } from './config';
import { visitNodeAndChildren } from './visitNodeAndChildren';
import { visitor } from './visitor';

export function transformer(
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
        const libName = context.factory.createUniqueName('compositeCall');
        const composeName = context.factory.createIdentifier(
            config.composeFunctionName
        );
        const transformedFile = visitNodeAndChildren(
            file,
            program,
            context,
            {
                libName,
                composeName,
            },
            visitor,
            config
        );
        return transformedFile;
    };
}
