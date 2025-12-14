import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all tasks
 *       403:
 *         description: Admin access required
 */
export const getAllTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { tasks, pagination } = await TaskService.getAllTasks(req.query as any);

        sendSuccess(res, 'All tasks retrieved successfully', { tasks }, 200, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
export const getAllUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await AuthService.getAllUsers();

        sendSuccess(res, 'All users retrieved successfully', { users });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
export const deleteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await AuthService.deleteUser(req.params.id);

        sendSuccess(res, 'User deleted successfully');
    } catch (error) {
        next(error);
    }
};
