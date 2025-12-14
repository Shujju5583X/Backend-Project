import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(1, 'Email is required')
        .max(255, 'Email is too long'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long')
        .trim(),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
