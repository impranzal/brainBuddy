import { Router } from 'express';
import {
  uploadAdminPicture,
  uploadResource, deleteResource, getAllResources,
  getAllUsers, getUserProgressReport,
  getTopStreakUsers, logoutAdmin, getAdminProfile, getAdminHonourBoard, uploadNotice,
  getAllNoticesController
} from '../controller/admin.controller';

import { apiLimiter } from '../middleware/ratelimit.middleware';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Temporary admin registration endpoint (remove in production)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        isApproved: true
      }
    });
    
    res.status(201).json({ message: 'Admin created successfully', admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
router.get('/notices', getAllNoticesController);

export default router;
