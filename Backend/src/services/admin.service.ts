import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
// import { createAccessToken } from '../utils/jwt';
// import { uploadToCloud } from '../utils/upload'; // if using Cloudinary or similar

const prisma = new PrismaClient();

// 1. Register Admin
// Removed: registerAdminService
// 2. Login Admin
// Removed: loginAdminService

// 3. Upload Admin Picture
export const uploadAdminPictureService = async (user: any, file: any) => {
  if (!file) throw new Error('No file uploaded');

 

  return { message: 'Profile picture uploaded (mocked)' };
};

// 4. Upload Resource
export const uploadResourceService = async ({ title, type, semester, subject, url }: any) => {
  if (!title || !type || !semester || !subject || !url) {
    throw new Error('All fields are required');
  }

  const resource = await prisma.resource.create({
    data: { title, type, semester, subject, url },
  });

  return { message: 'Resource uploaded successfully', resource };
};

// 5. Delete Resource
export const deleteResourceService = async (id: string) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new Error('Resource not found');

  await prisma.resource.delete({ where: { id } });

  return { message: 'Resource deleted successfully' };
};

// 6. Get All Resources
export const getAllResourcesService = async () => {
  const resources = await prisma.resource.findMany();
  return { resources };
};

// 7. Get All Users
export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  return { users };
};

// 8. Get User Progress Report
export const getUserProgressReportService = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const completedResources = await prisma.completedResource.findMany({
    where: { userId },
    include: { resource: true },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    progress: completedResources.map((cr) => ({
      resourceTitle: cr.resource.title,
      completedAt: cr.completedAt,
    })),
  };
};

// 9. Honour Board (Top Streak Users)
export const getTopStreakUsersService = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { progress: { streak: 'desc' } },
    take: 10,
  });

  return { users };
};

// 10. Logout Admin
export const logoutAdminService = async (_user: any) => {
  return { message: 'Logout successful' };
};

// 11. Get Admin Profile
export const getAdminProfileService = async (userId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
    },
  });
  if (!admin || admin.role !== 'ADMIN') {
    throw new Error('Admin not found or not authorized');
  }
  return admin;
};

// 12. Admin Honour Board with Search
export const getAdminHonourBoardService = async (search?: string) => {
  const where: any = {
    role: 'USER',
  };
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    include: {
      progress: true,
    },
    orderBy: [
      { progress: { xp: 'desc' } },
      { progress: { streak: 'desc' } },
    ],
    take: 20,
  });
  return users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    xp: u.progress?.xp || 0,
    streak: u.progress?.streak || 0,
  }));
};
