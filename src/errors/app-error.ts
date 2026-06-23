import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class AppError extends Error {
    constructor(
        public readonly statusCode: ContentfulStatusCode,
        message: string,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
