import { Router } from 'express';
import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
} from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, validateAll } from '../middlewares/validate.middleware';
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    taskQuerySchema,
} from '../validators/task.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task routes
router.get('/', validate(taskQuerySchema, 'query'), getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', validate(taskIdSchema, 'params'), getTask);
router.post('/', validate(createTaskSchema), createTask);
router.put(
    '/:id',
    validateAll({ params: taskIdSchema, body: updateTaskSchema }),
    updateTask
);
router.delete('/:id', validate(taskIdSchema, 'params'), deleteTask);

export default router;
