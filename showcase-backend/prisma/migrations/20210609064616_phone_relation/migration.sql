-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_phone_fkey";

-- AddForeignKey
ALTER TABLE "SmsVerification" ADD FOREIGN KEY ("phone") REFERENCES "User"("phone") ON DELETE CASCADE ON UPDATE CASCADE;
