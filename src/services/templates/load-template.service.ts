import type { CreateProjectInput } from '@/api/projects/project.validation';
import { AppError } from '@/errors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
const TEMPLATES_DIR = join(process.cwd(), 'src', 'templates');
type ProjectTemplate = 'react-ts' | 'react-js';
export const loadTemplateService = {
    getTemplatePath(template: ProjectTemplate) {
        const templatePath = join(TEMPLATES_DIR, template);
        if (!existsSync(templatePath)) {
            throw new AppError(404, `Template "${template}" does not exist.`);
        }
        return templatePath;
    },
};
