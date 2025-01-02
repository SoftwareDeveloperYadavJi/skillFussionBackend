/*
  Warnings:

  - You are about to drop the column `secoundUserId` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `secondUserId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SkillExchange_userId_key";

-- DropIndex
DROP INDEX "SocialMedia_userId_key";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "secoundUserId",
ADD COLUMN     "secondUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "googleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
