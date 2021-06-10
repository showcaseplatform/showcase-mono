-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "allowEmailSending" BOOLEAN NOT NULL DEFAULT false,
    "allowSmsSending" BOOLEAN NOT NULL DEFAULT false,
    "allowPushSending" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_id_unique" ON "NotificationSettings"("id");

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
