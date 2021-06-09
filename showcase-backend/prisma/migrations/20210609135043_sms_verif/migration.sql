-- DropForeignKey
ALTER TABLE "SmsVerification" DROP CONSTRAINT "SmsVerification_phone_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("phone") REFERENCES "SmsVerification"("phone") ON DELETE SET NULL ON UPDATE CASCADE;
