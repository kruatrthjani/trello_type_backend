-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "roleType" AS ENUM ('DEVELOPER', 'CLIENT', 'MANAGER');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('client', 'inhouse');

-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER', 'CLIENT');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('PENDING', 'INPROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT,
    "providerId" TEXT,
    "role" "roleType" NOT NULL DEFAULT 'DEVELOPER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "category" TEXT,
    "projectOrigin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDuration" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "clientId" TEXT,
    "projectManagerId" TEXT,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "Boards" (
    "boardId" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "boardDescription" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("boardId")
);

-- CreateTable
CREATE TABLE "BoardMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardId" TEXT NOT NULL,
    "cardTitle" TEXT NOT NULL,
    "cardDescription" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_clientId_key" ON "Projects"("projectName", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Boards_boardName_projectId_key" ON "Boards"("boardName", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardMember_userId_boardId_key" ON "BoardMember"("userId", "boardId");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

