/*
  Warnings:

  - You are about to drop the column `salePrice` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `saleDonationAmount` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `saleCurrency` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "salePrice",
DROP COLUMN "saleDonationAmount",
DROP COLUMN "saleCurrency";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationToken" TEXT;
