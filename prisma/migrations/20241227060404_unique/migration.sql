/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SkillExchange` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SkillExchange_userId_key" ON "SkillExchange"("userId");
