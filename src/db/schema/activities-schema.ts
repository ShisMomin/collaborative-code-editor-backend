import {
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { project } from './projects-schema';
import { user } from './auth-schema';
import { activityTypeEnum } from './enums';

export const activity = pgTable(
    'activities',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        projectId: uuid('project_id')
            .notNull()
            .references(() => project.id, {
                onDelete: 'cascade',
            }),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'cascade',
            }),
        type: activityTypeEnum('type').notNull(),
        metadata: jsonb('metadata'),
        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index('activities_project_idx').on(table.projectId),
        index('activities_user_idx').on(table.userId),
    ],
);
