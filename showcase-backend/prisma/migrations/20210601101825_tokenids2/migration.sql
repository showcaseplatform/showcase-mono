/*
  Warnings:

  - You are about to drop the column `creatorProfileId` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `ownerProfileId` on the `BadgeItem` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `BadgeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `BadgeItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BadgeItem" DROP CONSTRAINT "BadgeItem_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeItem" DROP CONSTRAINT "BadgeItem_ownerProfileId_fkey";

-- AlterTable
ALTER TABLE "BadgeItem" DROP COLUMN "creatorProfileId",
DROP COLUMN "ownerProfileId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
