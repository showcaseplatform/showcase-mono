/*
  Warnings:

  - You are about to drop the column `authId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.authId_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authId";
