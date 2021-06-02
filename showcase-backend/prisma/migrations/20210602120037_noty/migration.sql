-- CreateEnum
CREATE TYPE "ExpoStatus" AS ENUM ('ok', 'error');

-- CreateEnum
CREATE TYPE "ExpoError" AS ENUM ('DeviceNotRegistered', 'InvalidCredentials', 'MessageTooBig', 'MessageRateExceeded');

-- CreateEnum
CREATE TYPE "ExpoType" AS ENUM ('ticket', 'receipt');

-- CreateTable
CREATE TABLE "ExpoAdmin" (
    "id" SERIAL NOT NULL,
    "type" "ExpoType" NOT NULL,
    "status" "ExpoStatus" NOT NULL,
    "expoId" TEXT,
    "message" TEXT,
    "error" "ExpoError",

    PRIMARY KEY ("id")
);
