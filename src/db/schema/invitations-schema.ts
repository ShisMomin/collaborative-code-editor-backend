import {
    index,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from 'drizzle-orm/pg-core';
import { project } from './projects-schema';
import { user } from './auth-schema';
import { invitationStatusEnum } from './enums';

export const invitation = pgTable(
    'invitations',
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
        receiverId: text('receiver_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'cascade',
            }),
        status: invitationStatusEnum('status').notNull().default('PENDING'),
        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index('invitations_project_idx').on(table.projectId),
        index('invitations_receiver_idx').on(table.receiverId),
        unique('invitations_project_receiver_unique').on(
            table.projectId,
            table.receiverId,
        ),
    ],
);
