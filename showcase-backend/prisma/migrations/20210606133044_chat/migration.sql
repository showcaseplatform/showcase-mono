/*
  Warnings:

  - You are about to drop the column `sentAt` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `ChatMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "sentAt",
DROP COLUMN "readAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ChatMessageRead" (
    "id" SERIAL NOT NULL,
    "messageId" TEXT NOT NULL,
    "readById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD FOREIGN KEY ("readById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
