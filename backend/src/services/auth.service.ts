import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '@prisma/client';
import prisma from '../config/database';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { JwtPayload } from '../types';

// Exclude password from user response
type SafeUser = Omit<User, 'password'>;

export class AuthService {
    /**
     * Register a new user
     */
    static async register(data: RegisterInput): Promise<{ user: SafeUser; token: string }> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });

        if (existingUser) {
            throw ApiError.conflict('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                password: hashedPassword,
                name: data.name,
                role: Role.USER,
            },
        });

        // Generate token
        const token = this.generateToken(user);

        // Return user without password
        const { password: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    /**
     * Login user
     */
    static async login(data: LoginInput): Promise<{ user: SafeUser; token: string }> {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });

        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user);

        // Return user without password
        const { password: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<SafeUser | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    /**
     * Generate JWT token
     */
    private static generateToken(user: User): string {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn as any,
        });
    }

    /**
     * Get all users (admin only)
     */
    static async getAllUsers(): Promise<SafeUser[]> {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return users;
    }

    /**
     * Delete user (admin only)
     */
    static async deleteUser(id: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        await prisma.user.delete({ where: { id } });
    }
}
