/*
  Warnings:

  - You are about to drop the column `image` on the `BadgeType` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `BadgeType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT NOT NULL;
