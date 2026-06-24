import { db } from '@/db';
import type { CreateProjectServiceInput } from '@/api/projects/project.validation';
import { project as projectTable } from '@/db/schema/projects-schema';
import { projectMember as projectMemberTable } from '@/db/schema/project-members-schema';
import { activity as activityTable } from '@/db/schema/activities-schema';
import { loadTemplateService } from '../templates/load-template.service';
import { templateTreeService } from '../templates/template-tree.service';
import { insertTemplateService } from '../templates/insert-template.service';
import { AppError } from '@/errors';

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
                throw new AppError(500, 'Failed to create project.');
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

            // Locate the selected template on disk (e.g. react-ts, react-js nextjs, etc.).
            // The template contains the initial file and folder structure for the project.
            const templatePath = loadTemplateService.getTemplatePath(template);

            // Convert the template directory into an in-memory tree structure
            // so it can be recursively inserted into the database.
            const tree = templateTreeService.build(templatePath);

            // Populate the newly created project with the template files and folders.
            // This gives the user a ready-to-use starting workspace immediately after creation.
            await insertTemplateService.insert(tx, newProject.id, tree);
            return newProject;
        });
    },
};
