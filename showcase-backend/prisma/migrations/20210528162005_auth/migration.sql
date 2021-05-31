/*
  Warnings:

  - The primary key for the `LikeBadge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `badgeId` on the `LikeBadge` table. All the data in the column will be lost.
  - You are about to drop the column `badgeId` on the `Receipt` table. All the data in the column will be lost.
  - The primary key for the `ViewBadge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `badgeId` on the `ViewBadge` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[badgeItemId]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `badgeItemId` to the `LikeBadge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeItemId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeItemId` to the `ViewBadge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('Pending', 'Accepted', 'Declined', 'Unfollowed');

-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_badgeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_ownerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "LikeBadge" DROP CONSTRAINT "LikeBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "ViewBadge" DROP CONSTRAINT "ViewBadge_badgeId_fkey";

-- DropIndex
DROP INDEX "Receipt_badgeId_unique";

-- AlterTable
ALTER TABLE "BadgeType" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "LikeBadge" DROP CONSTRAINT "LikeBadge_pkey",
DROP COLUMN "badgeId",
ADD COLUMN     "badgeItemId" TEXT NOT NULL,
ADD PRIMARY KEY ("profileId", "badgeItemId");

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" TEXT,
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "badgeId",
ADD COLUMN     "badgeItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ViewBadge" DROP CONSTRAINT "ViewBadge_pkey",
DROP COLUMN "badgeId",
ADD COLUMN     "badgeItemId" TEXT NOT NULL,
ADD PRIMARY KEY ("profileId", "badgeItemId");

-- DropTable
DROP TABLE "Badge";

-- CreateTable
CREATE TABLE "BadgeItem" (
    "id" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "ownerProfileId" TEXT NOT NULL,
    "edition" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "removedFromShowcase" BOOLEAN NOT NULL DEFAULT false,
    "forSale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "profileId" TEXT NOT NULL,
    "followerProfileId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("profileId","followerProfileId")
);

-- CreateTable
CREATE TABLE "SmsVerification" (
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codesSent" INTEGER NOT NULL,
    "codesSentSinceValid" INTEGER NOT NULL,
    "attemptsEntered" INTEGER NOT NULL,
    "attemptsEnteredSinceValid" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "expiration" INTEGER NOT NULL,

    PRIMARY KEY ("phone")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile.username_unique" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile.email_unique" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_badgeItemId_unique" ON "Receipt"("badgeItemId");

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("creatorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("followerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBadge" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("phone") REFERENCES "SmsVerification"("phone") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewBadge" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
