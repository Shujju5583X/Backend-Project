import { Router } from 'express';
import { getAllTasks, getAllUsers, deleteUser } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { taskQuerySchema, taskIdSchema } from '../validators/task.validator';
import { z } from 'zod';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Admin routes
router.get('/tasks', validate(taskQuerySchema, 'query'), getAllTasks);
router.get('/users', getAllUsers);
router.delete(
    '/users/:id',
    validate(z.object({ id: z.string().uuid() }), 'params'),
    deleteUser
);

export default router;
