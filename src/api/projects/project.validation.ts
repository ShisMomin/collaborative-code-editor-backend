import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().max(1000).optional(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']),
    template: z.enum(['react-ts']),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateProjectServiceInput = CreateProjectInput & {
    ownerId: string;
};
