import type { PgTransaction } from 'drizzle-orm/pg-core';
import { file as fileTable } from '@/db/schema/files-schema';
import type { TemplateNode } from './template.types';
import { AppError } from '@/errors';

async function insertNodes(
    tx: PgTransaction<any, any, any>,
    projectId: string,
    nodes: TemplateNode[],
    parentId: string | null,
): Promise<void> {
    for (const node of nodes) {
        const [created] = await tx
            .insert(fileTable)
            .values({
                projectId,
                parentId,
                name: node.name,
                type: node.type,
                content: node.content,
                language: node.language,
                isReadOnly: node.isReadOnly,
            })
            .returning();
        if (!created) {
            throw new AppError(
                500,
                `Failed to create template file "${node.name}".`,
            );
        }
        if (
            node.type === 'FOLDER' &&
            node.children &&
            node.children.length > 0
        ) {
            await insertNodes(tx, projectId, node.children, created.id);
        }
    }
}

export const insertTemplateService = {
    async insert(
        tx: PgTransaction<any, any, any>,
        projectId: string,
        tree: TemplateNode[],
    ) {
        await insertNodes(tx, projectId, tree, null);
    },
};
