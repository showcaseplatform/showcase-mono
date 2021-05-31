/*
  Warnings:

  - The primary key for the `Badge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokenId` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `saleId` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `contributionsAmount` on the `Cause` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `id` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeTypeId` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerProfileId` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSpentAmountConvertedUsd` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_saleId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile.userId_unique";

-- DropIndex
DROP INDEX "Badge.saleId_unique";

-- AlterTable
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_pkey",
DROP COLUMN "tokenId",
DROP COLUMN "saleId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "badgeTypeId" TEXT NOT NULL,
ADD COLUMN     "ownerProfileId" TEXT NOT NULL,
ADD COLUMN     "removedFromShowcase" BOOLEAN NOT NULL DEFAULT false,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "totalSpentAmountConvertedUsd" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cause" DROP COLUMN "contributionsAmount",
ADD COLUMN     "numberOfContributions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "kycVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Receipt" (
    "id" SERIAL NOT NULL,
    "recipientProfileId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "stripeChargeId" TEXT NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "saleDonationAmount" INTEGER,
    "saleCurrency" "Currency" NOT NULL,
    "convertedPrice" INTEGER NOT NULL,
    "convertedRate" INTEGER NOT NULL,
    "convertedCurrency" "Currency" NOT NULL,
    "causeId" INTEGER,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stripe" (
    "id" SERIAL NOT NULL,
    "ownerProfileId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "lastFourCardDigit" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Receipt.transactionHash_unique" ON "Receipt"("transactionHash");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_badgeId_unique" ON "Receipt"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe.ownerProfileId_unique" ON "Stripe"("ownerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe.stripeId_unique" ON "Stripe"("stripeId");

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("recipientProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("creatorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("causeId") REFERENCES "Cause"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
