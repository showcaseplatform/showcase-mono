/*
  Warnings:

  - You are about to drop the column `tokenTypeBlockhainId` on the `BadgeType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenTypeId]` on the table `BadgeType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `BadgeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenTypeId` to the `BadgeType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BadgeType.tokenTypeBlockhainId_unique";

-- AlterTable
ALTER TABLE "BadgeItem" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "tokenTypeBlockhainId",
ADD COLUMN     "tokenTypeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType.tokenTypeId_unique" ON "BadgeType"("tokenTypeId");
