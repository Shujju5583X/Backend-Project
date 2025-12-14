import { Task, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../utils/ApiError';
import { CreateTaskInput, UpdateTaskInput, TaskQuery } from '../validators/task.validator';
import { parsePagination, createPaginationInfo } from '../utils/response';
import { PaginationInfo } from '../types';

export class TaskService {
    /**
     * Create a new task
     */
    static async create(userId: string, data: CreateTaskInput): Promise<Task> {
        const task = await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });

        return task;
    }

    /**
     * Get tasks for a specific user with pagination and filtering
     */
    static async getUserTasks(
        userId: string,
        query: TaskQuery
    ): Promise<{ tasks: Task[]; pagination: PaginationInfo }> {
        const { skip, take, page, limit } = parsePagination(query.page, query.limit);

        // Build where clause
        const where: Prisma.TaskWhereInput = {
            userId,
            ...(query.status && { status: query.status }),
            ...(query.priority && { priority: query.priority }),
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
        };

        // Build orderBy
        const orderBy: Prisma.TaskOrderByWithRelationInput = {
            [query.sortBy || 'createdAt']: query.order || 'desc',
        };

        // Execute query with count
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            prisma.task.count({ where }),
        ]);

        return {
            tasks,
            pagination: createPaginationInfo(page, limit, total),
        };
    }

    /**
     * Get all tasks (admin only) with pagination
     */
    static async getAllTasks(
        query: TaskQuery
    ): Promise<{ tasks: (Task & { user: { name: string; email: string } })[]; pagination: PaginationInfo }> {
        const { skip, take, page, limit } = parsePagination(query.page, query.limit);

        // Build where clause
        const where: Prisma.TaskWhereInput = {
            ...(query.status && { status: query.status }),
            ...(query.priority && { priority: query.priority }),
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
        };

        const orderBy: Prisma.TaskOrderByWithRelationInput = {
            [query.sortBy || 'createdAt']: query.order || 'desc',
        };

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return {
            tasks,
            pagination: createPaginationInfo(page, limit, total),
        };
    }

    /**
     * Get a single task by ID
     */
    static async getById(id: string, userId?: string, isAdmin: boolean = false): Promise<Task> {
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            throw ApiError.notFound('Task not found');
        }

        // If not admin, verify ownership
        if (!isAdmin && task.userId !== userId) {
            throw ApiError.forbidden('You do not have permission to access this task');
        }

        return task;
    }

    /**
     * Update a task
     */
    static async update(
        id: string,
        userId: string,
        data: UpdateTaskInput,
        isAdmin: boolean = false
    ): Promise<Task> {
        // First check if task exists and user has access
        await this.getById(id, userId, isAdmin);

        const task = await prisma.task.update({
            where: { id },
            data,
        });

        return task;
    }

    /**
     * Delete a task
     */
    static async delete(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
        // First check if task exists and user has access
        await this.getById(id, userId, isAdmin);

        await prisma.task.delete({
            where: { id },
        });
    }

    /**
     * Get task statistics for a user
     */
    static async getStats(userId: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
    }> {
        const [total, pending, inProgress, completed] = await Promise.all([
            prisma.task.count({ where: { userId } }),
            prisma.task.count({ where: { userId, status: 'PENDING' } }),
            prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
            prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
        ]);

        return { total, pending, inProgress, completed };
    }
}
