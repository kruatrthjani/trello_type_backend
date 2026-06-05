/*
  Warnings:

  - You are about to drop the column `role` on the `BoardMember` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BoardRole" ADD VALUE 'CLIENT';

-- AlterTable
ALTER TABLE "BoardMember" DROP COLUMN "role";
