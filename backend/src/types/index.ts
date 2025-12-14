import { Request } from 'express';
import { Role } from '@prisma/client';

// Extended Express Request with user info
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
    };
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: ValidationError[];
    pagination?: PaginationInfo;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// JWT Payload
export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    role: Role;
    iat?: number;
    exp?: number;
}

// Query params for pagination
export interface PaginationQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

// Task filter query
export interface TaskFilterQuery extends PaginationQuery {
    status?: string;
    priority?: string;
    search?: string;
}
