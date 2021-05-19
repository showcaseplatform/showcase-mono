/*
  Warnings:

  - Added the required column `updatedAt` to the `BadgeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Cause` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BadgeType_resallerProfileId_unique";

-- DropIndex
DROP INDEX "BadgeType_creatorProfileId_unique";

-- AlterTable
ALTER TABLE "BadgeType" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Cause" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Badge" (
    "tokenId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "edition" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("tokenId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge.saleId_unique" ON "Badge"("saleId");

-- AddForeignKey
ALTER TABLE "Badge" ADD FOREIGN KEY ("saleId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD FOREIGN KEY ("creatorProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
