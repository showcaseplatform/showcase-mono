/*
  Warnings:

  - You are about to drop the column `forSale` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `BadgeType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `description` on the `BadgeType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(240)`.

*/
-- DropIndex
DROP INDEX "BadgeType.tokenTypeBlockhainId_unique";

-- DropIndex
DROP INDEX "BadgeType.uri_unique";

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "forSale" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "forSale",
ALTER COLUMN "title" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(240);
