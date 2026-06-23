import { AppError } from '@/errors';
import type { Context } from 'hono';
import { ZodError } from 'zod';

export const errorhandler = async (err: Error, c: Context) => {
    if (err instanceof ZodError) {
        return c.json(
            {
                success: false,
                message: 'Validation failed',
                errors: err.issues,
            },
            400,
        );
    }
    if (err instanceof AppError) {
        return c.json(
            {
                success: false,
                message: err.message,
            },
            err.statusCode,
        );
    }
    // console.error(err);
    return c.json(
        {
            success: false,
            message: 'Internal server error',
        },
        500,
    );
};
