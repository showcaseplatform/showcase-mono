/*
  Warnings:

  - You are about to drop the `SmsVerification` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_phone_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- DropTable
DROP TABLE "SmsVerification";
