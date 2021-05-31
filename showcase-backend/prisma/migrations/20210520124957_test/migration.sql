/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "ownerProfileId" TEXT NOT NULL,
    "eur" INTEGER NOT NULL,
    "gbp" INTEGER NOT NULL,
    "usd" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyRate" (
    "code" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,

    PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance.ownerProfileId_unique" ON "Balance"("ownerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User.phone_unique" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
