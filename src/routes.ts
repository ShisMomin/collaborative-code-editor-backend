import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import type { AppContext } from './types';
import { requireAuth, setAuthContext } from './middlewares/auth';
import { loggerMiddleware } from './middlewares/logger';
import { errorhandler } from './middlewares/error-handler';
import projectRouter from './api/projects/project.routes';

const app = new Hono<AppContext>();
app.use(
    '*',
    cors({
        origin: [
            'http://localhost:4173',
            'http://localhost:5173',
            'http://localhost:3000',
        ],
        credentials: true,
    }),
);
app.get('/', (c) => {
    return c.text('Hello from collaborative code editor backend');
});
app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));

const protectedApp = new Hono<AppContext>();
protectedApp.use('*', setAuthContext);
protectedApp.use('*', requireAuth);
protectedApp.use('*', loggerMiddleware);
protectedApp.route('/projects', projectRouter);

app.route('/api', protectedApp);
app.onError(errorhandler);

export default {
    port: process.env.HTTP_PORT || 3001,
    fetch: app.fetch,
};
