import prisma from '../connect/prisma';

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