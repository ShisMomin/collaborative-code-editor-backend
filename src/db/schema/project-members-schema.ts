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
import { projectMemberRoleEnum } from './enums';
export const projectMember = pgTable(
    'project_members',
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
        role: projectMemberRoleEnum('role').notNull(),
        joinedAt: timestamp('joined_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index('project_members_project_idx').on(table.projectId),
        index('project_members_user_idx').on(table.userId),
        unique('project_members_project_user_unique').on(
            table.projectId,
            table.userId,
        ),
    ],
);
