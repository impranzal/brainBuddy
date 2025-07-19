import { Router } from 'express';
import {
  uploadAdminPicture,
  uploadResource, deleteResource, getAllResources,
  getAllUsers, getUserProgressReport,
  getTopStreakUsers, logoutAdmin, getAdminProfile, getAdminHonourBoard, uploadNotice
} from '../controller/admin.controller';

import { apiLimiter } from '../middleware/ratelimit.middleware';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/logout', protect, logoutAdmin);

router.use(protect);
router.use(restrictTo('admin'));

router.put('/profile-picture', upload.single('file'), uploadAdminPicture);
router.post('/resources', uploadResource);
router.delete('/resources/:id', deleteResource);
router.get('/resources', getAllResources);
router.get('/users', getAllUsers);
router.get('/progress/:userId', getUserProgressReport);
router.get('/honour-board', protect, restrictTo('admin'), getAdminHonourBoard);
router.get('/profile', protect, restrictTo('admin'), getAdminProfile);
router.post('/upload-notice', upload.single('file'), uploadNotice);

export default router;
