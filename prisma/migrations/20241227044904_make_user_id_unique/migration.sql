/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Education` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Education_userId_key" ON "Education"("userId");
