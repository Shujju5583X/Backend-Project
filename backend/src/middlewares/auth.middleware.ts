import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AuthRequest, JwtPayload } from '../types';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';
import prisma from '../config/database';

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for token in cookies first (more secure)
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        // Then check Authorization header
        else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw ApiError.unauthorized('Authentication required. Please log in.');
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!user) {
            throw ApiError.unauthorized('User no longer exists');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Role-based authorization middleware
 * @param roles - Array of allowed roles
 */
export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`)
            );
        }

        next();
    };
};

/**
 * Shorthand for requiring admin role
 */
export const requireAdmin = authorize(Role.ADMIN);

/**
 * Shorthand for requiring any authenticated user
 */
export const requireUser = authorize(Role.USER, Role.ADMIN);
