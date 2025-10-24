-- AlterTable
ALTER TABLE "MeditationLog" ADD COLUMN     "guided" BOOLEAN,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "stressLevelAfter" INTEGER,
ADD COLUMN     "stressLevelBefore" INTEGER,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "technique" TEXT;
