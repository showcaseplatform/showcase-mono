/*
  Warnings:

  - You are about to drop the column `creatorProfileId` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `resallerProfileId` on the `BadgeType` table. All the data in the column will be lost.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followerProfileId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `isCreator` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `kycVerified` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `recipientProfileId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `creatorProfileId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the `LikeBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikeBadgeType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ViewBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ViewBadgeType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `BadgeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerUserId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `expiration` on the `SmsVerification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "LikeBadge" DROP CONSTRAINT "LikeBadge_badgeItemId_fkey";

-- DropForeignKey
ALTER TABLE "LikeBadge" DROP CONSTRAINT "LikeBadge_profileId_fkey";

-- DropForeignKey
ALTER TABLE "LikeBadgeType" DROP CONSTRAINT "LikeBadgeType_badgeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "LikeBadgeType" DROP CONSTRAINT "LikeBadgeType_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ViewBadge" DROP CONSTRAINT "ViewBadge_badgeItemId_fkey";

-- DropForeignKey
ALTER TABLE "ViewBadge" DROP CONSTRAINT "ViewBadge_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ViewBadgeType" DROP CONSTRAINT "ViewBadgeType_badgeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ViewBadgeType" DROP CONSTRAINT "ViewBadgeType_profileId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeItem" DROP CONSTRAINT "BadgeItem_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeItem" DROP CONSTRAINT "BadgeItem_ownerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeType" DROP CONSTRAINT "BadgeType_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeType" DROP CONSTRAINT "BadgeType_resallerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_id_fkey";

-- DropForeignKey
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_creatorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_recipientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "SmsVerification" DROP CONSTRAINT "SmsVerification_phone_fkey";

-- DropForeignKey
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_id_fkey";

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "creatorProfileId",
DROP COLUMN "resallerProfileId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "resallerId" TEXT;

-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
DROP COLUMN "profileId",
DROP COLUMN "followerProfileId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "followerUserId" TEXT NOT NULL,
ADD PRIMARY KEY ("userId", "followerUserId");

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "isCreator",
DROP COLUMN "kycVerified",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "recipientProfileId",
DROP COLUMN "creatorProfileId",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SmsVerification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "expiration",
ADD COLUMN     "expiration" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isCreator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kycVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "LikeBadge";

-- DropTable
DROP TABLE "LikeBadgeType";

-- DropTable
DROP TABLE "ViewBadge";

-- DropTable
DROP TABLE "ViewBadgeType";

-- CreateTable
CREATE TABLE "BadgeItemLike" (
    "userId" TEXT NOT NULL,
    "badgeItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeItemId")
);

-- CreateTable
CREATE TABLE "BadgeTypeLike" (
    "userId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeTypeId")
);

-- CreateTable
CREATE TABLE "BadgeItemView" (
    "userId" TEXT NOT NULL,
    "badgeItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeItemId")
);

-- CreateTable
CREATE TABLE "BadgeTypeView" (
    "userId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeTypeId")
);

-- AddForeignKey
ALTER TABLE "BadgeItemLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemLike" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeLike" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemView" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemView" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeView" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeView" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("creatorProfileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("resallerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("phone") REFERENCES "SmsVerification"("phone") ON DELETE CASCADE ON UPDATE CASCADE;
