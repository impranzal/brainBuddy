-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ALTER COLUMN "fileUrl" DROP NOT NULL;
