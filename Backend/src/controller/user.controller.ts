import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../utils/appError';
import { getUserProfileService } from '../services/user.service';
import { updateUserProfileService } from '../services/user.service';
import { generateTutorResponseService } from '../services/user.service';
import { getAllNotices, getNoticeById } from '../services/notice.service';
import path from 'path';
import fs from 'fs';
import { getGeminiResponse } from '../utils/gemini';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.registerUserService(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Registration failed', 500));
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.loginUserService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Login failed', 500));
  }
};

export const getUserDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserDashboardService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch dashboard', 500));
  }
};

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.uploadProfilePictureService(req.user, req.file);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to upload profile picture', 500));
  }
};

export const getUserStreak = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserStreakService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch streak', 500));
  }
};

export const getUserXP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserXPService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch XP', 500));
  }
};

export const updateUserXP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUserXPService(req.user, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update XP', 500));
  }
};

export const updateUserStreak = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUserStreakService(req.user, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update streak', 500));
  }
};

export const markResourceCompleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.markResourceCompletedService(req.user, req.params.resourceId);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to mark resource as completed', 500));
  }
};

export const generateTutorResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await generateTutorResponseService(req.user, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to generate tutor response', 500));
  }
};


export const startTeachingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.startTeachingSessionService(req.user, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to start AI teaching session', 500));
  }
};

export const getGamifyStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getGamifyStatsService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch gamify stats', 500));
  }
};

export const getHabitStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getHabitStatsService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch habit stats', 500));
  }
};

export const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllResourcesService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch resources', 500));
  }
};

export const getResourceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getResourceByIdService(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch resource', 500));
  }
};

export const getCompletedResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getCompletedResourcesService(req.user);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch completed resources', 500));
  }
};

export const getTopStreakUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getTopStreakUsersService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch honour board', 500));
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.logoutUserService();
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Logout failed', 500));
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const profile = await getUserProfileService(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};


export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    const profilePicture = req.file;

    const result = await updateUserProfileService(userId, data, profilePicture);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: result,
    });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update profile', 500));
  }
};

export const saveTutorResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.saveTutorResponseService(req.user, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to save AI tutor response', 500));
  }
};

export const rateTutorResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.rateTutorResponseService(req.user, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to rate AI tutor response', 500));
  }
};

export const markSessionUnderstood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.markSessionUnderstoodService(req.user, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to mark session as understood', 500));
  }
};

export const getFlashcardsByTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = req.query.topic as string;
    const result = await userService.getFlashcardsByTopicService(topic);
    res.status(200).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to get flashcards', 500));
  }
};

export const getAllNoticesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notices = await getAllNotices();
    res.status(200).json({ notices });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch notices', 500));
  }
};

export const getNoticeByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notice = await getNoticeById(req.params.id);
    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }
    
    // Only serve file if fileUrl exists
    if (notice.fileUrl) {
      const filePath = path.join(__dirname, '../../', notice.fileUrl);
      if (!fs.existsSync(filePath)) {
        return next(new AppError('File not found', 404));
      }
      res.download(filePath, err => {
        if (err) {
          next(new AppError('Error downloading file', 500));
        }
      });
    } else {
      // Return notice data if no file
      res.status(200).json(notice);
    }
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch notice', 500));
  }
};

export const proxyGemini = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    const result = await getGeminiResponse(prompt);
    res.status(200).json({ result });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to get Gemini response', 500));
  }
};

export const getUserQuizProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await userService.getUserQuizProgressService(req.user);
    res.status(200).json({ quizProgress: progress });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch quiz progress', 500));
  }
};

export const updateUserQuizProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await userService.updateUserQuizProgressService(req.user, req.body.quizData);
    res.status(200).json({ quizProgress: progress });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update quiz progress', 500));
  }
};

export const getUserPetState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petState = await userService.getUserPetStateService(req.user);
    res.status(200).json({ petState });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch pet state', 500));
  }
};

export const updateUserPetState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petState = await userService.updateUserPetStateService(req.user, req.body);
    res.status(200).json({ petState });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update pet state', 500));
  }
};

export const getUserAchievements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await userService.getUserAchievementsService(req.user);
    res.status(200).json({ achievements });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch achievements', 500));
  }
};

export const updateUserAchievements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await userService.updateUserAchievementsService(req.user, req.body.achievements);
    res.status(200).json({ achievements });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update achievements', 500));
  }
};

export const getUserBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = await userService.getUserBadgesService(req.user);
    res.status(200).json({ badges });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to fetch badges', 500));
  }
};

export const updateUserBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = await userService.updateUserBadgesService(req.user, req.body.badges);
    res.status(200).json({ badges });
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update badges', 500));
  }
};