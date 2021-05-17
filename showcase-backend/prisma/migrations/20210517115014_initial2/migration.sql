/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCreator` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Art', 'Music', 'Photo', 'Misc', 'Podcast', 'Animals', 'Style');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "isCreator" BOOLEAN NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT E'USD',
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BadgeType" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "ownerProfileId" TEXT NOT NULL,
    "tokenTypeBlockhainId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT E'Art',
    "removedFromShowcase" BOOLEAN NOT NULL DEFAULT false,
    "shares" INTEGER NOT NULL,
    "supply" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType.tokenTypeBlockhainId_unique" ON "BadgeType"("tokenTypeBlockhainId");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType_creatorProfileId_unique" ON "BadgeType"("creatorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType_ownerProfileId_unique" ON "BadgeType"("ownerProfileId");

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("creatorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
