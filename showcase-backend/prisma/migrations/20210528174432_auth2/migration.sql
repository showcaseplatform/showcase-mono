/*
  Warnings:

  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_phone_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SmsVerification" ADD FOREIGN KEY ("phone") REFERENCES "User"("phone") ON DELETE CASCADE ON UPDATE CASCADE;
