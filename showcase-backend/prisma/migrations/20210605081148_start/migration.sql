/*
  Warnings:

  - You are about to drop the column `isCreator` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('basic', 'creator');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isCreator",
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT E'basic';
