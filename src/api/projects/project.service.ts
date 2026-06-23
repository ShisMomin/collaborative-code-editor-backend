import { db } from '@/db';
import type { CreateProjectServiceInput } from './project.validation';
import { project as projectTable } from '@/db/schema/projects-schema';
import { projectMember as projectMemberTable } from '@/db/schema/project-members-schema';
import { activity as activityTable } from '@/db/schema/activities-schema';

export const projectService = {
    async createProject({
        template,
        ownerId,
        ...projectData
    }: CreateProjectServiceInput) {
        // Execute all database operations in a single transaction.
        // If any step fails, every change is rolled back to keep the data consistent.
        return await db.transaction(async (tx) => {
            // Create the project and return the newly inserted row.
            const [newProject] = await tx
                .insert(projectTable)
                .values({
                    ...projectData,
                    ownerId,
                })
                .returning();

            if (!newProject) {
                throw new Error('Failed to create project.');
            }
            // The project creator is automatically added as the owner.
            // This determines their permissions within the project.
            await tx.insert(projectMemberTable).values({
                projectId: newProject.id,
                userId: ownerId,
                role: 'OWNER',
            });

            // Record the project creation in the activity log.
            // This can later be used for an activity feed or audit history.
            await tx.insert(activityTable).values({
                projectId: newProject.id,
                userId: ownerId,
                type: 'PROJECT_CREATED',
                metadata: {},
            });
            return newProject;
        });
    },
};
