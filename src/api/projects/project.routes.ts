import { Hono } from 'hono';
import { createProject } from './project.controller';

const projectRouter = new Hono();
projectRouter.post('/', createProject);

export default projectRouter;
