import {
    Node,
    Program,
    SourceFile,
    TransformationContext,
    visitEachChild,
} from 'typescript';

import type { TransformerConfig } from './config';
import { Identifiers } from './typings';

export type NodeVisitor = (
    node: Node,
    program: Program,
    context: TransformationContext,
    identifiers: Identifiers,
    config: TransformerConfig
) => Node | Node[] | undefined;

export function visitNodeAndChildren(
    file: SourceFile,
    program: Program,
    context: TransformationContext,
    identifiers: Identifiers,
    nodeVisitor: NodeVisitor,
    config: TransformerConfig
): SourceFile;

export function visitNodeAndChildren(
    file: Node,
    program: Program,
    context: TransformationContext,
    identifiers: Identifiers,
    nodeVisitor: NodeVisitor,
    config: TransformerConfig
): Node | Node[] | undefined;

export function visitNodeAndChildren(
    node: Node,
    program: Program,
    context: TransformationContext,
    identifiers: Identifiers,
    nodeVisitor: NodeVisitor,
    config: TransformerConfig
): Node | Node[] | undefined {
    const visitorResult = nodeVisitor(
        node,
        program,
        context,
        identifiers,
        config
    );

    const visit = (node: Node | undefined) =>
        node &&
        visitEachChild(
            node,
            (child) =>
                visitNodeAndChildren(
                    child,
                    program,
                    context,
                    identifiers,
                    nodeVisitor,
                    config
                ),
            context
        );

    if (!Array.isArray(visitorResult)) {
        return visit(visitorResult);
    } else {
        return visitorResult
            .map((node) => visit(node))
            .filter((value) => value !== undefined) as Node[];
    }
}
