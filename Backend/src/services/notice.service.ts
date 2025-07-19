import prisma from '../connect/prisma';

export const createNotice = async (data: {
  title: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
}) => {
  return prisma.notice.create({
    data,
  });
};

export const getAllNotices = async () => {
  return prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getNoticeById = async (id: string) => {
  return prisma.notice.findUnique({
    where: { id },
  });
}; 