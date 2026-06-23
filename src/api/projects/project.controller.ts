import type { Context } from 'hono';
import { createProjectSchema } from './project.validation';
import { projectService } from './project.service';

export const createProject = async (c: Context) => {
    // Parse request body
    const body = await c.req.json();

    const user = c.get('user');
    // Validate request
    const data = createProjectSchema.parse(body);
    // Call service
    const project = await projectService.createProject({
        ...data,
        ownerId: user.id,
    });
    // Return response
    return c.json(
        {
            success: true,
            data: project,
        },
        201,
    );
};
