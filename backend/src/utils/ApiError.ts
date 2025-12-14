/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: { field: string; message: string }[];

    constructor(
        message: string,
        statusCode: number = 500,
        errors?: { field: string; message: string }[]
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, errors?: { field: string; message: string }[]) {
        return new ApiError(message, 400, errors);
    }

    static unauthorized(message: string = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    static forbidden(message: string = 'Forbidden') {
        return new ApiError(message, 403);
    }

    static notFound(message: string = 'Resource not found') {
        return new ApiError(message, 404);
    }

    static conflict(message: string) {
        return new ApiError(message, 409);
    }

    static internal(message: string = 'Internal server error') {
        return new ApiError(message, 500);
    }
}
