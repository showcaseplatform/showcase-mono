/*
  Warnings:

  - Changed the type of `authyId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User.authyId_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authyId",
ADD COLUMN     "authyId" INTEGER NOT NULL;
