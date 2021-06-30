-- AlterTable
ALTER TABLE "BadgeType" ADD COLUMN     "resallerId" TEXT;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("resallerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
