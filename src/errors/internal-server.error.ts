import { AppError } from './app-error';

export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(500, message);
    }
}
