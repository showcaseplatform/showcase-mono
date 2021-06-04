/*
  Warnings:

  - You are about to drop the column `eur` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the column `gbp` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the column `usd` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the column `balanceEur` on the `Cause` table. All the data in the column will be lost.
  - You are about to drop the column `balanceGpb` on the `Cause` table. All the data in the column will be lost.
  - You are about to drop the column `balanceUsd` on the `Cause` table. All the data in the column will be lost.
  - You are about to drop the column `encrytpedPrivateKey` on the `Crypto` table. All the data in the column will be lost.
  - Added the required column `encryptedPrivateKey` to the `Crypto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "eur",
DROP COLUMN "gbp",
DROP COLUMN "usd",
ADD COLUMN     "EUR" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "GBP" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "USD" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "totalSpentAmountConvertedUsd" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Cause" DROP COLUMN "balanceEur",
DROP COLUMN "balanceGpb",
DROP COLUMN "balanceUsd",
ADD COLUMN     "balanceEUR" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "balanceGBP" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "balanceUSD" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Crypto" DROP COLUMN "encrytpedPrivateKey",
ADD COLUMN     "encryptedPrivateKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stripe" ALTER COLUMN "lastFourCardDigit" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Transferwise" (
    "id" TEXT NOT NULL,
    "idUSD" TEXT,
    "accountNumberUSD" TEXT,
    "idGBP" TEXT,
    "accountNumberGBP" TEXT,
    "idEUR" TEXT,
    "accountNumberEUR" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "customerTransactionId" TEXT NOT NULL,
    "transactionId" TEXT,
    "quote" TEXT NOT NULL,
    "targetAccount" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "success" BOOLEAN,
    "error" TEXT,
    "eta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transferwise" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
