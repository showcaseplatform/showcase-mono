-- AlterTable
ALTER TABLE "BadgeType" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "causeId" DROP NOT NULL,
ALTER COLUMN "donationAmount" DROP NOT NULL;
