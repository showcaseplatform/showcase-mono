/*
  Warnings:

  - You are about to drop the column `views` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `authyId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "views",
DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "views",
DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Stripe" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authyId";

-- CreateTable
CREATE TABLE "LikeBadge" (
    "profileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("profileId","badgeId")
);

-- CreateTable
CREATE TABLE "LikeBadgeType" (
    "profileId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("profileId","badgeTypeId")
);

-- CreateTable
CREATE TABLE "ViewBadge" (
    "profileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("profileId","badgeId")
);

-- CreateTable
CREATE TABLE "ViewBadgeType" (
    "profileId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("profileId","badgeTypeId")
);

-- AddForeignKey
ALTER TABLE "LikeBadge" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBadge" ADD FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBadgeType" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBadgeType" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewBadge" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewBadge" ADD FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewBadgeType" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewBadgeType" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
