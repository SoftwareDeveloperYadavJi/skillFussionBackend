/*
  Warnings:

  - You are about to drop the column `platform` on the `SocialMedia` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `SocialMedia` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "endDate" TEXT NOT NULL,
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "startDate" TEXT NOT NULL,
ALTER COLUMN "degree" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SocialMedia" DROP COLUMN "platform",
DROP COLUMN "url",
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT;
