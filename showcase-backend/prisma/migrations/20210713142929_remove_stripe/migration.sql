/*
  Warnings:

  - You are about to drop the column `creatorId` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `removedFromShowcase` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `soldout` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `resallerId` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `badgeTypeId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `stripeChargeId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the `Stripe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageId` to the `BadgeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chargeId` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_userId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeItem" DROP CONSTRAINT "BadgeItem_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeType" DROP CONSTRAINT "BadgeType_resallerId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_badgeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_recipientId_fkey";

-- AlterTable
ALTER TABLE "BadgeItem" DROP COLUMN "creatorId";

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "removedFromShowcase",
DROP COLUMN "image",
DROP COLUMN "soldout",
DROP COLUMN "resallerId",
ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "badgeTypeId",
DROP COLUMN "stripeChargeId",
DROP COLUMN "recipientId",
DROP COLUMN "creatorId",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "chargeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Stripe";

-- CreateTable
CREATE TABLE "PaymentInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idToken" TEXT NOT NULL,
    "lastFourCardDigit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo.userId_unique" ON "PaymentInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo.idToken_unique" ON "PaymentInfo"("idToken");

-- AddForeignKey
ALTER TABLE "PaymentInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
