-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('basic', 'creator');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('causes', 'art', 'music', 'gaming', 'style', 'sports', 'animals', 'podcasts', 'vlogs', 'travel', 'culinary', 'technology');

-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('Accepted', 'Unfollowed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_BADGE_PUBLISHED', 'NEW_FOLLOWER_ADDED', 'SOLD_BADGES_SUMMARY', 'MOST_VIEWED_BADGE', 'NEW_MESSAGE_RECEIVED', 'NEW_FRIEND_MESSAGE_RECEIVED');

-- CreateEnum
CREATE TYPE "ExpoStatus" AS ENUM ('ok', 'error');

-- CreateEnum
CREATE TYPE "ExpoError" AS ENUM ('DeviceNotRegistered', 'InvalidCredentials', 'MessageTooBig', 'MessageRateExceeded');

-- CreateEnum
CREATE TYPE "ExpoType" AS ENUM ('ticket', 'receipt');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "userType" "UserType" NOT NULL DEFAULT E'basic',
    "kycVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "notificationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "email" TEXT,
    "currency" "Currency" NOT NULL DEFAULT E'USD',
    "birthDate" TIMESTAMP(3),
    "avatarId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeType" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "tokenTypeId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "supply" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT E'USD',
    "sold" INTEGER NOT NULL DEFAULT 0,
    "imageId" TEXT NOT NULL,
    "imageHash" TEXT NOT NULL,
    "causeId" INTEGER,
    "donationAmount" DOUBLE PRECISION DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "Category" NOT NULL DEFAULT E'art',
    "shares" INTEGER NOT NULL DEFAULT 0,
    "gif" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeItem" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "edition" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "forSale" BOOLEAN NOT NULL DEFAULT false,
    "salePrice" DOUBLE PRECISION,
    "saleCurrency" "Currency",
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "sellDate" TIMESTAMP(3),
    "shares" INTEGER NOT NULL DEFAULT 0,
    "removedFromShowcase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cause" (
    "id" SERIAL NOT NULL,
    "balanceEUR" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceGBP" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceUSD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "numberOfContributions" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crypto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "encryptedMnemonic" TEXT NOT NULL,
    "encryptedPrivateKey" TEXT NOT NULL,
    "ivMnemonic" TEXT NOT NULL,
    "ivPrivateKey" TEXT NOT NULL,
    "passwordHint" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "EUR" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "GBP" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "USD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSpentAmountConvertedUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyRate" (
    "id" SERIAL NOT NULL,
    "EUR" DOUBLE PRECISION NOT NULL,
    "GBP" DOUBLE PRECISION NOT NULL,
    "USD" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "badgeItemId" TEXT NOT NULL,
    "stripeChargeId" TEXT NOT NULL,
    "convertedPrice" DOUBLE PRECISION NOT NULL,
    "convertedRate" DOUBLE PRECISION NOT NULL,
    "convertedCurrency" "Currency" NOT NULL,
    "causeId" INTEGER,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stripe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "lastFourCardDigit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transferwise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idUSD" TEXT,
    "accountNumberUSD" TEXT,
    "idGBP" TEXT,
    "accountNumberGBP" TEXT,
    "idEUR" TEXT,
    "accountNumberEUR" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "customerTransactionId" TEXT NOT NULL,
    "transactionId" TEXT,
    "quote" TEXT NOT NULL,
    "targetAccount" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "success" BOOLEAN,
    "error" TEXT,
    "eta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeItemLike" (
    "userId" TEXT NOT NULL,
    "badgeItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeItemId")
);

-- CreateTable
CREATE TABLE "BadgeTypeLike" (
    "userId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeTypeId")
);

-- CreateTable
CREATE TABLE "BadgeItemView" (
    "userId" TEXT NOT NULL,
    "badgeItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeItemId")
);

-- CreateTable
CREATE TABLE "BadgeTypeView" (
    "userId" TEXT NOT NULL,
    "badgeTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","badgeTypeId")
);

-- CreateTable
CREATE TABLE "Follow" (
    "userId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","followerId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "allowPushSending" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id","type")
);

-- CreateTable
CREATE TABLE "ExpoAdmin" (
    "id" TEXT NOT NULL,
    "type" "ExpoType" NOT NULL,
    "status" "ExpoStatus" NOT NULL,
    "expoId" TEXT,
    "message" TEXT,
    "error" "ExpoError",

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatParticipant" (
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chatId","userId")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessageRead" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "readById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.phone_unique" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile.username_unique" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile.email_unique" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType.tokenTypeId_unique" ON "BadgeType"("tokenTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeType.uri_unique" ON "BadgeType"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto.userId_unique" ON "Crypto"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Balance.userId_unique" ON "Balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt.transactionHash_unique" ON "Receipt"("transactionHash");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_badgeItemId_unique" ON "Receipt"("badgeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe.userId_unique" ON "Stripe"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe.stripeId_unique" ON "Stripe"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Transferwise.userId_unique" ON "Transferwise"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeType" ADD FOREIGN KEY ("causeId") REFERENCES "Cause"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItem" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD FOREIGN KEY ("causeId") REFERENCES "Cause"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferwise" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemLike" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeLike" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemView" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeItemView" ADD FOREIGN KEY ("badgeItemId") REFERENCES "BadgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeView" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTypeView" ADD FOREIGN KEY ("badgeTypeId") REFERENCES "BadgeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageRead" ADD FOREIGN KEY ("readById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
