/*
  Warnings:

  - You are about to drop the column `resallerId` on the `BadgeType` table. All the data in the column will be lost.
  - You are about to drop the column `resale` on the `BadgeType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BadgeType" DROP CONSTRAINT "BadgeType_resallerId_fkey";

-- AlterTable
ALTER TABLE "BadgeItem" ADD COLUMN     "salePrice" DOUBLE PRECISION,
ADD COLUMN     "saleCurrency" "Currency",
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BadgeType" DROP COLUMN "resallerId",
DROP COLUMN "resale";
