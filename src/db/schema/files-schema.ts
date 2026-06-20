import {
    index,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
    type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { project } from './projects-schema';
import { fileLanguageEnum, fileTypeEnum } from './enums';

export const file = pgTable(
    'files',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        projectId: uuid('project_id')
            .notNull()
            .references(() => project.id, {
                onDelete: 'cascade',
            }),
        parentId: uuid('parent_id').references((): AnyPgColumn => file.id, {
            onDelete: 'cascade',
        }),
        name: varchar('name', {
            length: 255,
        }).notNull(),
        type: fileTypeEnum('type').notNull(),
        content: text('content'),
        language: fileLanguageEnum('language'),
        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index('files_project_parent_idx').on(table.projectId, table.parentId),
        unique('files_project_parent_name_unique').on(
            table.projectId,
            table.parentId,
            table.name,
        ),
    ],
);
