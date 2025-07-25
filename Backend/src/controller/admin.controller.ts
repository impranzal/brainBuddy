import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import { AppError } from '../utils/appError';
import { createNotice, getAllNotices, deleteNotice } from '../services/notice.service';
import path from 'path';

export const uploadAdminPicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.uploadAdminPictureService(req.user, req.file);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Upload failed', 500));
  }
};

export const uploadResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.uploadResourceService(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Resource upload failed', 500));
  }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.deleteResourceService(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to delete resource', 500));
  }
};

export const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getAllResourcesService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch resources', 500));
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getAllUsersService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch users', 500));
  }
};

export const getUserProgressReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getUserProgressReportService(req.params.userId);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch progress report', 500));
  }
};

export const getTopStreakUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getTopStreakUsersService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch honour board', 500));
  }
};

export const logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.logoutAdminService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Logout failed', 500));
  }
};

export const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const profile = await adminService.getAdminProfileService(userId);
    res.status(200).json(profile);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch admin profile', 500));
  }
};

export const getAdminHonourBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const leaderboard = await adminService.getAdminHonourBoardService(search);
    res.status(200).json(leaderboard);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch honour board', 500));
  }
};

export const uploadNotice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title || !description) {
      return next(new AppError('Title and description are required', 400));
    }
    
    let fileUrl = '';
    if (req.file) {
      // Save file to disk (if using diskStorage) or buffer (memoryStorage)
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const fs = require('fs');
      const uploadPath = path.join(__dirname, '../../uploads', fileName);
      fs.writeFileSync(uploadPath, req.file.buffer);
      fileUrl = `/uploads/${fileName}`;
    }
    
    const notice = await createNotice({
      title,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      fileUrl: fileUrl || undefined,
      uploadedBy: req.user.userId,
    });
    res.status(201).json({ message: 'Notice uploaded successfully', notice });
  } catch (error: any) {
    next(new AppError(error.message || 'Notice upload failed', 500));
  }
};

export const getAllNoticesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notices = await getAllNotices();
    res.status(200).json(notices);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch notices', 500));
  }
};

export const deleteNoticeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteNotice(id);
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to delete notice', 500));
  }
};