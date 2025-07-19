import prisma from '../connect/prisma';
import fs from 'fs';
import path from 'path';

export const createNotice = async (data: {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  fileUrl?: string;
  uploadedBy: string;
}) => {
  return prisma.notice.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category || 'general',
      priority: data.priority || 'medium',
      fileUrl: data.fileUrl,
      uploadedBy: data.uploadedBy,
    },
  });
};

export const getAllNotices = async () => {
  return prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const getNoticeById = async (id: string) => {
  return prisma.notice.findUnique({
    where: { id },
  });
};

export const deleteNotice = async (id: string) => {
  // First get the notice to check if it has a file
  const notice = await prisma.notice.findUnique({
    where: { id }
  });

  if (!notice) {
    throw new Error('Notice not found');
  }

  // Delete the associated file if it exists
  if (notice.fileUrl) {
    try {
      const filePath = path.join(__dirname, '../../', notice.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with notice deletion even if file deletion fails
    }
  }

  // Delete the notice from database
  return prisma.notice.delete({
    where: { id }
  });
}; 