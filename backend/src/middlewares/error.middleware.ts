import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';
import { config } from '../config';

/**
 * Global error handling middleware
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    // Log error in development
    if (config.nodeEnv === 'development') {
        console.error('Error:', err);
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return sendError(res, 'Validation failed', 400, errors);
    }

    // Handle custom API errors
    if (err instanceof ApiError) {
        return sendError(res, err.message, err.statusCode, err.errors);
    }

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                // Unique constraint violation
                const field = (err.meta?.target as string[])?.join(', ') || 'field';
                return sendError(res, `A record with this ${field} already exists`, 409);
            case 'P2025':
                // Record not found
                return sendError(res, 'Record not found', 404);
            case 'P2003':
                // Foreign key constraint
                return sendError(res, 'Related record not found', 400);
            default:
                return sendError(res, 'Database error', 500);
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return sendError(res, 'Invalid data provided', 400);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', 401);
    }

    // Default error response
    const message = config.nodeEnv === 'production'
        ? 'Internal server error'
        : err.message;

    return sendError(res, message, 500);
};

/**
 * Handle 404 - Route not found
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
