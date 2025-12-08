-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'REPRESENTATIVE', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "district" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "verifyExp" TIMESTAMP(3),
    "isRepresentative" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "position" TEXT,
    "party" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "tasksTotal" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "attendance" DOUBLE PRECISION DEFAULT 0.0,
    "lastActivity" TIMESTAMP(3),
    "gosuslugiId" TEXT,
    "sberId" TEXT,
    "tinkoffId" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "device" TEXT,
    "ip" TEXT,
    "exp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_gosuslugiId_key" ON "users"("gosuslugiId");

-- CreateIndex
CREATE UNIQUE INDEX "users_sberId_key" ON "users"("sberId");

-- CreateIndex
CREATE UNIQUE INDEX "users_tinkoffId_key" ON "users"("tinkoffId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_hashedToken_key" ON "tokens"("hashedToken");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
