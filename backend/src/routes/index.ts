import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import adminRoutes from './admin.routes';

const router = Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

export default router;
