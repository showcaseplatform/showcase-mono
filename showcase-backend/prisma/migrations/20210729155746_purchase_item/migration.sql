/*
  Warnings:

  - You are about to drop the column `purchaseDate` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `isSold` on the `BadgeItem` table. All the data in the column will be lost.
  - You are about to drop the column `sellDate` on the `BadgeItem` table. All the data in the column will be lost.
  - Added the required column `price` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Receipt.badgeItemId_unique";

-- AlterTable
ALTER TABLE "BadgeItem" DROP COLUMN "purchaseDate",
DROP COLUMN "isSold",
DROP COLUMN "sellDate",
ADD COLUMN     "forSaleDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL;
