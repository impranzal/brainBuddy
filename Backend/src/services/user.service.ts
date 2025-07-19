import bcrypt from 'bcryptjs';
import prisma from '../connect/prisma';
import { createAccessToken } from '../jwt/token';
import { uploadToCloudinary } from '../utils/cloudinary'; // optional if using cloud
import { validateEmail, validatePasswordStrength } from '../utils/validators';
import { getGeminiResponse } from '../utils/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

export const registerUserService = async ({ username, name, email, password }: any) => {
  if (!username || !name || !email || !password) throw new Error('All fields are required');

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already registered. Please use a different email.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userCount = await prisma.user.count();

  // Assign role: first  users is ADMIN, rest are USER
  let role: 'ADMIN' | 'USER' = 'USER';
  if (userCount < 1) {
    role = 'ADMIN';
  }
  const isApproved = true;

  const user = await prisma.user.create({
    data: { username, name, email, password: hashedPassword, role, isApproved },
  });

  const token = createAccessToken(user.id, user.email, user.role);

  return {
    message: 'User created successfully.',
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUserService = async ({ email, password }: any) => {
  if (!email || !password) throw new Error('Email and password are required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid password');

  const token = createAccessToken(user.id, user.email, user.role);

  return {
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const logoutUserService = () => {
  return { message: 'Logout successful' };
};

export const getUserDashboardService = async (user: any) => {
  const profile = await prisma.user.findUnique({ where: { id: user.userId } });
  return {
    message: 'Dashboard fetched',
    data: profile,
  };
};

export const uploadProfilePictureService = async (user: any, file: any) => {
  if (!file) throw new Error('No file uploaded');
  
  // Convert file buffer to base64
  const base64Image = file.buffer.toString('base64');
  const mimeType = file.mimetype || 'image/jpeg';
  
  // Create data URL for the frontend
  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  
  const updated = await prisma.user.update({
    where: { id: user.userId },
    data: { profilePicture: base64Image },
  });
  
  return { 
    message: 'Profile picture updated', 
    profilePictureUrl: dataUrl,
    url: dataUrl,
    data: updated 
  };
};

export const getUserStreakService = async (user: any) => {
  const streak = await prisma.userProgress.findFirst({ where: { userId: user.userId } });
  return { streak: streak?.streak || 0 };
};

export const getUserXPService = async (user: any) => {
  const xp = await prisma.userProgress.findFirst({ where: { userId: user.userId } });
  return { xp: xp?.xp || 0 };
};

export const updateUserXPService = async (user: any, data: any) => {
  const { xp } = data;
  if (xp === undefined || xp < 0) throw new Error('Valid XP value required');

  // Find existing progress or create new one
  let userProgress = await prisma.userProgress.findFirst({ where: { userId: user.userId } });
  
  if (userProgress) {
    // Update existing progress
    userProgress = await prisma.userProgress.update({
      where: { id: userProgress.id },
      data: { xp: parseInt(xp) }
    });
  } else {
    // Create new progress record
    userProgress = await prisma.userProgress.create({
      data: { 
        userId: user.userId, 
        xp: parseInt(xp),
        streak: 0
      }
    });
  }

  return { 
    message: 'XP updated successfully',
    xp: userProgress.xp 
  };
};

export const updateUserStreakService = async (user: any, data: any) => {
  const { streak } = data;
  if (streak === undefined || streak < 0) throw new Error('Valid streak value required');

  // Find existing progress or create new one
  let userProgress = await prisma.userProgress.findFirst({ where: { userId: user.userId } });
  
  if (userProgress) {
    // Update existing progress
    userProgress = await prisma.userProgress.update({
      where: { id: userProgress.id },
      data: { streak: parseInt(streak) }
    });
  } else {
    // Create new progress record
    userProgress = await prisma.userProgress.create({
      data: { 
        userId: user.userId, 
        streak: parseInt(streak),
        xp: 0
      }
    });
  }

  return { 
    message: 'Streak updated successfully',
    streak: userProgress.streak 
  };
};

export const markResourceCompletedService = async (user: any, resourceId: string) => {
  await prisma.completedResource.create({
    data: { userId: user.userId, resourceId },
  });
  return { message: 'Resource marked as completed' };
};

export const getCompletedResourcesService = async (user: any) => {
  const completedResources = await prisma.completedResource.findMany({
    where: { userId: user.userId },
    include: { resource: true },
  });
  return { completedResources };
};
export const generateTutorResponseService = async (user: any, body: any) => {
  const { topic, mode } = body;
  if (!topic || !mode) throw new Error('Topic and mode required');

  // Compose a prompt for Gemini
  const prompt = `Explain the topic "${topic}" in "${mode}" mode. Also, generate 5 flashcard questions for this topic. Respond in JSON with two fields: explanation and flashcards (an array of strings).`;

  const aiResponse = await getGeminiResponse(prompt);

  // Try to extract and parse JSON from Gemini's response
  let explanation = '';
  let flashcards: string[] = [];

  try {
    let jsonText = aiResponse;

    // Remove code block markers if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Parse JSON
    const parsed = JSON.parse(jsonText);

    explanation = parsed.explanation || '';
    flashcards = parsed.flashcards || [];
  } catch (e) {
    // If not valid JSON, just return the raw text as explanation
    explanation = aiResponse;
    flashcards = [];
  }

  return { explanation, flashcards };
};


export const startTeachingSessionService = async (user: any, body: any) => {
  const { explanation } = body;
  if (!explanation) throw new Error('Explanation required');

  // Get Gemini API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Stricter prompt for Gemini
  const prompt = `
A student provided the following explanation: "${explanation}".

1. Analyze the explanation for correctness, clarity, and completeness.
2. Suggest improvements or corrections.
3. Give a revised/improved version of the answer.
4. Score the answer out of 100 and explain the score.
5. Suggest XP points to award (0-20) based on the quality of the answer.

Respond ONLY with a valid JSON object, no markdown, no code block, no explanation, no extra text. The JSON should be:
{
  "feedback": "...",
  "improved": "...",
  "score": ...,
  "xp": ...
}
`;

  // Get AI response
  const aiResponse = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  let feedback = '', improved = '', score = 0, xpEarned = 0;
  let jsonText = aiResponse.response.text();
  try {
    // Remove everything before first { and after last }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(jsonText);
    feedback = parsed.feedback || '';
    improved = parsed.improved || '';
    score = parsed.score || 0;
    xpEarned = parsed.xp || 0;
  } catch (e) {
    feedback = 'AI could not parse the response. Raw: ' + jsonText;
    improved = '';
    score = 0;
    xpEarned = 0;
  }

  // Optionally, update user XP in the database
  const userId = user.id || user.userId;
  if (!userId) throw new Error('User ID not found in session');
  if (xpEarned > 0) {
    await prisma.userProgress.upsert({
      where: { userId },
      update: { xp: { increment: xpEarned } },
      create: { userId, xp: xpEarned, streak: 0 },
    });
  }

  return { feedback, improved, score, xpEarned };
};

export const getGamifyStatsService = async (user: any) => {
  const progress = await prisma.userProgress.findFirst({ where: { userId: user.id } });
  return {
    xp: progress?.xp || 0,
    streak: progress?.streak || 0,
    badges: ['Streak Master', 'Quiz King'],
    level: Math.floor((progress?.xp || 0) / 100),
  };
};

export const getHabitStatsService = async (user: any) => {
  const habits = await prisma.userHabit.findMany({ where: { userId: user.id } });
  return { habits };
};

export const getAllResourcesService = async () => {
  const resources = await prisma.resource.findMany();
  return { resources };
};

export const getResourceByIdService = async (id: string) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  return { resource };
};

export const getTopStreakUsersService = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: [
      { progress: { xp: 'desc' } },
      { progress: { streak: 'desc' } },
    ],
    take: 10,
    include: {
      progress: true,
    },
  });
  return { users };
};

export const getUserProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      name: true,
      email: true,
      profilePicture: true,
      progress: {
        select: {
          streak: true,
          xp: true,
        }
      }
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Convert base64 profile picture to data URL if it exists
  let profilePictureUrl = null;
  if (user.profilePicture) {
    profilePictureUrl = `data:image/jpeg;base64,${user.profilePicture}`;
  }

  return {
    ...user,
    profilePictureUrl,
    streak: user.progress?.streak ?? 0,
    xp: user.progress?.xp ?? 0,
  };
};

export const updateUserProfileService = async (
  userId: string,
  data: any,
  profilePicture?: Express.Multer.File
) => {
  const { username, email, oldPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const updates: any = {};

  // Username
  if (username && username !== user.username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new Error('Username already taken');
    updates.username = username;
  }

  // Email
  if (email && email !== user.email) {
    if (!validateEmail(email)) throw new Error('Invalid email');
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already in use');
    updates.email = email;
  }

  // Password
  if (newPassword) {
    if (!oldPassword) throw new Error('Old password is required');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Old password is incorrect');

    if (oldPassword === newPassword) throw new Error('New password must be different');
    if (!validatePasswordStrength(newPassword)) throw new Error('Password too weak');

    const hashed = await bcrypt.hash(newPassword, 10);
    updates.password = hashed;
  }

  // Profile Picture
  if (profilePicture) {
    const result = await uploadToCloudinary(profilePicture.path, 'profile_pictures') as CloudinaryUploadResult;
    updates.profilePicture = result.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      username: true,
      email: true,
      profilePicture: true,
    },
  });

  return updatedUser;
};

export const saveTutorResponseService = async (user: any, data: any) => {
  const { topic, mode, response, flashcards } = data;
  if (!topic || !mode || !response || !flashcards) throw new Error('All fields are required');
  const saved = await prisma.savedTutorResponse.create({
    data: {
      userId: user.userId,
      topic,
      mode,
      response,
      flashcards: JSON.stringify(flashcards),
    },
  });
  return { message: 'AI tutor response saved', id: saved.id };
};

export const rateTutorResponseService = async (user: any, data: any) => {
  const { responseId, rating, feedback } = data;
  if (!responseId || typeof rating !== 'number') throw new Error('Response ID and rating required');
  const rated = await prisma.tutorResponseRating.create({
    data: {
      userId: user.userId,
      responseId,
      rating,
      feedback,
    },
  });
  return { message: 'AI tutor response rated', id: rated.id };
};

export const markSessionUnderstoodService = async (user: any, data: any) => {
  const { responseId } = data;
  if (!responseId) throw new Error('Response ID required');
  // Optionally, log the understood session here
  // Reward XP
  const progress = await prisma.userProgress.upsert({
    where: { userId: user.userId },
    update: { xp: { increment: 10 }, streak: { increment: 1 } },
    create: { userId: user.userId, xp: 10, streak: 1 },
  });
  return { message: 'Session marked as understood, XP rewarded', xp: progress.xp, streak: progress.streak };
};

export const getFlashcardsByTopicService = async (topic: string) => {
  if (!topic) throw new Error('Topic is required');
  // Compose a prompt for Gemini to only generate flashcards
  const prompt = `Generate 5 flashcard questions for the topic: "${topic}". Respond in JSON as { flashcards: [ ... ] }`;
  const aiResponse = await getGeminiResponse(prompt);
  let flashcards: string[] = [];
  try {
    let jsonText = aiResponse;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
    }
    const parsed = JSON.parse(jsonText);
    flashcards = parsed.flashcards || [];
  } catch (e) {
    // If not valid JSON, return empty array
    flashcards = [];
  }
  return { flashcards };
};
