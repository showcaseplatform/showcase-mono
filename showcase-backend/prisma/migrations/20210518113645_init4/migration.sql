/*
  Warnings:

  - You are about to drop the column `ownerProfileId` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `BadgeType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `BadgeType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[resallerProfileId]` on the table `BadgeType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `BadgeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageHash` to the `BadgeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `causeId` to the `BadgeType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BadgeType" DROP CONSTRAINT "BadgeType_ownerProfileId_fkey";

-- DropIndex
DROP INDEX "BadgeType_ownerProfileId_unique";

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "ownerProfileId",
ADD COLUMN     "resallerProfileId" TEXT,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT E'USD',
ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "imageHash" TEXT NOT NULL,
ADD COLUMN     "causeId" INTEGER NOT NULL,
ADD COLUMN     "donationAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "soldout" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gif" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "shares" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Cause" (
    "id" SERIAL NOT NULL,
    "balanceEur" INTEGER NOT NULL DEFAULT 0,
    "balanceGpb" INTEGER NOT NULL DEFAULT 0,
    "balanceUsd" INTEGER NOT NULL DEFAULT 0,
    "contributionsAmount" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType_resallerProfileId_unique" ON "BadgeType"("resallerProfileId");

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("resallerProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("causeId") REFERENCES "Cause"("id") ON DELETE CASCADE ON UPDATE CASCADE;
