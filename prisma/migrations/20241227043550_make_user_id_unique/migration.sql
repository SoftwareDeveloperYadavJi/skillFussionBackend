/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SocialMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_userId_key" ON "SocialMedia"("userId");
