import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';

const app = new Hono();
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
    return c.text('Hellow from collaborative code editor backend');
});
app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));
export default {
    port: process.env.HTTP_PORT || 3001,
    fetch: app.fetch,
};
