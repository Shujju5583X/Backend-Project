import { Response } from 'express';
import { ApiResponse, PaginationInfo } from '../types';

/**
 * Send a successful API response
 */
export const sendSuccess = <T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    pagination?: PaginationInfo
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        pagination,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send an error API response
 */
export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: { field: string; message: string }[]
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
        errors,
    };
    return res.status(statusCode).json(response);
};

/**
 * Parse pagination query parameters
 */
export const parsePagination = (
    page?: string,
    limit?: string
): { skip: number; take: number; page: number; limit: number } => {
    const parsedPage = Math.max(1, parseInt(page || '1', 10));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit || '10', 10)));

    return {
        page: parsedPage,
        limit: parsedLimit,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
    };
};

/**
 * Create pagination info object
 */
export const createPaginationInfo = (
    page: number,
    limit: number,
    total: number
): PaginationInfo => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});
