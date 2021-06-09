/*
  Warnings:

  - The values [Art,Music,Photo,Misc,Podcast,Animals,Style] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pending,Declined] on the enum `FollowStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `numberOfContributions` on the `Cause` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The primary key for the `CurrencyRate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `CurrencyRate` table. All the data in the column will be lost.
  - Added the required column `EUR` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GBP` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('causes', 'art', 'music', 'gaming', 'style', 'sports', 'animals', 'podcasts', 'vlogs', 'travel', 'culinary', 'technology');
ALTER TABLE "BadgeType" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "BadgeType" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
ALTER TABLE "BadgeType" ALTER COLUMN "category" SET DEFAULT 'art';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FollowStatus_new" AS ENUM ('Accepted', 'Unfollowed');
ALTER TABLE "Follow" ALTER COLUMN "status" TYPE "FollowStatus_new" USING ("status"::text::"FollowStatus_new");
ALTER TYPE "FollowStatus" RENAME TO "FollowStatus_old";
ALTER TYPE "FollowStatus_new" RENAME TO "FollowStatus";
DROP TYPE "FollowStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "BadgeType" ALTER COLUMN "category" SET DEFAULT E'art';

-- AlterTable
ALTER TABLE "Cause" ALTER COLUMN "numberOfContributions" SET DEFAULT 0,
ALTER COLUMN "numberOfContributions" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CurrencyRate" DROP CONSTRAINT "CurrencyRate_pkey",
DROP COLUMN "code",
DROP COLUMN "rate",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "EUR" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "GBP" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "USD" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD PRIMARY KEY ("id");
