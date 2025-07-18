import { Router } from 'express';
import userRoutes from './user.router';
import adminRoutes from './admin.router';

const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
