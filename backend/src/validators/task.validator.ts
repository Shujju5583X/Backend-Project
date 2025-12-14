import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title is too long')
        .trim(),
    description: z
        .string()
        .max(2000, 'Description is too long')
        .optional()
        .nullable(),
    status: z
        .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
        .optional()
        .default(TaskStatus.PENDING),
    priority: z
        .enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH])
        .optional()
        .default(Priority.MEDIUM),
    dueDate: z
        .string()
        .datetime()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
});

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title is too long')
        .trim()
        .optional(),
    description: z
        .string()
        .max(2000, 'Description is too long')
        .optional()
        .nullable(),
    status: z
        .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
        .optional(),
    priority: z
        .enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH])
        .optional(),
    dueDate: z
        .string()
        .datetime()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
});

export const taskIdSchema = z.object({
    id: z.string().uuid('Invalid task ID'),
});

export const taskQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]).optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
