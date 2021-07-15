/*
  Warnings:

  - You are about to drop the column `stripeChargeId` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the `Stripe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chargeId` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'collector';

-- DropForeignKey
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_userId_fkey";

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "status" SET DEFAULT E'Accepted';

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "stripeChargeId",
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
