/*
  Warnings:

  - A unique constraint covering the columns `[authyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.authyId_unique" ON "User"("authyId");
