-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('client', 'inhouse');

-- CreateEnum
CREATE TYPE "Usertype" AS ENUM ('client', 'developer', 'designer', 'qa', 'internal');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "name" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "userType" "Usertype" NOT NULL DEFAULT 'internal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "category" TEXT,
    "projectOrigin" TEXT NOT NULL,
    "clientName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDuration" TEXT NOT NULL,
    "projectManager" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "Boards" (
    "boardId" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "boardAssigner" TEXT NOT NULL,
    "boardDescription" TEXT,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("boardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_clientName_key" ON "Projects"("projectName", "clientName");

