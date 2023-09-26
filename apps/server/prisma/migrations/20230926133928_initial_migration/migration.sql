---Custom Migrations
---UserTag
CREATE DOMAIN "UserTagLabel" as TEXT CHECK (value IS NOT NULL);
CREATE TYPE "UserTag" AS (
    "label" "UserTagLabel",
    "icon" TEXT,
    "color" VARCHAR(7)
);
---/Custom Migrations

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('EXPENSE', 'INCOME');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" CHAR(60) NOT NULL,
    "definedTags" "UserTag"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" MONEY NOT NULL,
    "tags" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "OperationType" NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sourceIp" INET,
    "agent" VARCHAR,
    "geolocation" DOUBLE PRECISION[],
    "refreshable" BOOLEAN NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Operation_ownerId_idx" ON "Operation"("ownerId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
