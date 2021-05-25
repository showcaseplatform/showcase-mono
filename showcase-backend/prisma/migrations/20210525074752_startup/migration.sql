/*
  Warnings:

  - The primary key for the `Balance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerProfileId` on the `Balance` table. All the data in the column will be lost.
  - The primary key for the `Crypto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerProfileId` on the `Crypto` table. All the data in the column will be lost.
  - The primary key for the `Stripe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerProfileId` on the `Stripe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_ownerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_ownerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_ownerProfileId_fkey";

-- DropIndex
DROP INDEX "Crypto.ownerProfileId_unique";

-- DropIndex
DROP INDEX "Balance.ownerProfileId_unique";

-- DropIndex
DROP INDEX "Stripe.ownerProfileId_unique";

-- AlterTable
ALTER TABLE "BadgeType" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_pkey",
DROP COLUMN "ownerProfileId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "eur" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "gbp" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "usd" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalSpentAmountConvertedUsd" SET DATA TYPE DOUBLE PRECISION,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Balance_id_seq";

-- AlterTable
ALTER TABLE "Cause" ALTER COLUMN "balanceEur" SET DEFAULT 0,
ALTER COLUMN "balanceEur" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "balanceGpb" SET DEFAULT 0,
ALTER COLUMN "balanceGpb" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "balanceUsd" SET DEFAULT 0,
ALTER COLUMN "balanceUsd" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "numberOfContributions" SET DEFAULT 0,
ALTER COLUMN "numberOfContributions" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_pkey",
DROP COLUMN "ownerProfileId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Crypto_id_seq";

-- AlterTable
ALTER TABLE "CurrencyRate" ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "salePrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "saleDonationAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "convertedPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "convertedRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_pkey",
DROP COLUMN "ownerProfileId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Stripe_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto" ADD FOREIGN KEY ("id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe" ADD FOREIGN KEY ("id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
