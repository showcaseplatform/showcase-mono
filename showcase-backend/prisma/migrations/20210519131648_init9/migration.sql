/*
  Warnings:

  - A unique constraint covering the columns `[uri]` on the table `BadgeType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uri` to the `BadgeType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BadgeType" ADD COLUMN     "uri" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Crypto" (
    "id" SERIAL NOT NULL,
    "ownerProfileId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "encryptedMnemonic" TEXT NOT NULL,
    "encrytpedPrivateKey" TEXT NOT NULL,
    "ivMnemonic" TEXT NOT NULL,
    "ivPrivateKey" TEXT NOT NULL,
    "passwordHint" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crypto.ownerProfileId_unique" ON "Crypto"("ownerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType.uri_unique" ON "BadgeType"("uri");

-- AddForeignKey
ALTER TABLE "Crypto" ADD FOREIGN KEY ("ownerProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
