import { Router } from 'express';
import {
  registerUser, loginUser, getUserDashboard,
  uploadProfilePicture, getUserStreak, getUserXP,
  updateUserXP, updateUserStreak,
  markResourceCompleted, generateTutorResponse,
  startTeachingSession, getGamifyStats,
  getHabitStats, getAllResources, getResourceById, getCompletedResources,
  getTopStreakUsers, logoutUser, getUserProfile, updateUserProfile,
  saveTutorResponse, rateTutorResponse, markSessionUnderstood, getFlashcardsByTopic,
  getAllNoticesController, getNoticeByIdController, proxyGemini
} from '../controller/user.controller';

import { apiLimiter } from '../middleware/ratelimit.middleware';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { validateUser } from '../middleware/validate.user';

const router = Router();

router.post('/signup', apiLimiter, validateUser, registerUser);
router.post('/login', apiLimiter, loginUser);
router.post('/logout', protect, logoutUser);

// Notice routes - accessible to both users and admins
router.get('/notices', protect, getAllNoticesController);
router.get('/notices/:id', protect, getNoticeByIdController);

router.use(protect);
router.use(restrictTo('user'));

router.get('/dashboard', getUserDashboard);
router.put('/profile-picture', upload.single('file'), uploadProfilePicture);
router.get('/streak', getUserStreak);
router.get('/xp', getUserXP);
router.put('/streak', updateUserStreak);
router.put('/xp', updateUserXP);
router.post('/mark-completed/:resourceId', markResourceCompleted);
router.post('/ai-tutor', generateTutorResponse);
router.post('/ai-tutor/save', protect, saveTutorResponse);
router.post('/ai-tutor/rate', protect, rateTutorResponse);
router.post('/ai-tutor/understood', protect, markSessionUnderstood);
router.post('/ai-student-mode', startTeachingSession);
router.get('/gamify', getGamifyStats);
router.get('/habit', getHabitStats);
router.get('/resources', getAllResources);
router.get('/resource/:id', getResourceById);
router.get('/completed-resources', getCompletedResources);
router.get('/honour-board', getTopStreakUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);
router.get('/ai-tutor/flashcards', protect, restrictTo('user'), getFlashcardsByTopic);
router.post('/gemini-proxy', proxyGemini);

export default router;
