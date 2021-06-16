/*
  Warnings:

  - You are about to drop the column `fromId` on the `ChatMessage` table. All the data in the column will be lost.
  - The primary key for the `ChatMessageRead` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ExpoAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Receipt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Withdrawal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Crypto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Stripe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Transferwise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromUserId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Crypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `NotificationSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Stripe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transferwise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_id_fkey";

-- DropForeignKey
ALTER TABLE "NotificationSettings" DROP CONSTRAINT "NotificationSettings_id_fkey";

-- DropForeignKey
ALTER TABLE "Stripe" DROP CONSTRAINT "Stripe_id_fkey";

-- DropForeignKey
ALTER TABLE "Transferwise" DROP CONSTRAINT "Transferwise_id_fkey";

-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "fromId",
ADD COLUMN     "fromUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessageRead" DROP CONSTRAINT "ChatMessageRead_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "ChatMessageRead_id_seq";

-- AlterTable
ALTER TABLE "Crypto" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExpoAdmin" DROP CONSTRAINT "ExpoAdmin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "ExpoAdmin_id_seq";

-- AlterTable
ALTER TABLE "NotificationSettings" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Receipt_id_seq";

-- AlterTable
ALTER TABLE "Stripe" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transferwise" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Withdrawal_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_unique" ON "Balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_userId_unique" ON "Crypto"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe_userId_unique" ON "Stripe"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transferwise_userId_unique" ON "Transferwise"("userId");

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferwise" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
