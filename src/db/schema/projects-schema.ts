import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    index,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { visibilityEnum } from './enums';

export const project = pgTable(
    'projects',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: varchar('name', {
            length: 100,
        }).notNull(),
        description: text('description'),
        ownerId: text('owner_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'restrict',
            }),
        visibility: visibilityEnum('visibility').notNull().default('PRIVATE'),
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
    (table) => [index('projects_owner_idx').on(table.ownerId)],
);
