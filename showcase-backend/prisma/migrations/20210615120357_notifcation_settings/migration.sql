/*
  Warnings:

  - You are about to drop the column `allowEmailSending` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `allowSmsSending` on the `NotificationSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "allowEmailSending",
DROP COLUMN "allowSmsSending";
