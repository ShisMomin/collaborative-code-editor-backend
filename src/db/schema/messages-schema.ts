import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { project } from './projects-schema';
import { user } from './auth-schema';

export const message = pgTable(
    'messages',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        projectId: uuid('project_id')
            .notNull()
            .references(() => project.id, {
                onDelete: 'cascade',
            }),
        senderId: text('sender_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'cascade',
            }),
        content: text('content').notNull(),
        replyToMessageId: uuid('reply_to_message_id').references(
            (): AnyPgColumn => message.id,
            {
                onDelete: 'set null',
            },
        ),
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
        deletedAt: timestamp('deleted_at', {
            withTimezone: true,
        }),
    },
    (table) => [
        index('messages_project_idx').on(table.projectId),
        index('messages_sender_idx').on(table.senderId),
        index('messages_reply_idx').on(table.replyToMessageId),
    ],
);
