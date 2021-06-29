/*
  Warnings:

  - You are about to drop the column `salePrice` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `saleCurrency` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `isSold` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `sellDate` on the `BadgeItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BadgeItem" DROP COLUMN "salePrice",
DROP COLUMN "saleCurrency",
DROP COLUMN "isSold",
DROP COLUMN "sellDate";

-- AlterTable
ALTER TABLE "BadgeType" ADD COLUMN     "resallerId" TEXT,
ADD COLUMN     "resale" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("resallerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
