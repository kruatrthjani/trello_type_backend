/*
  Warnings:

  - You are about to drop the column `boardDesription` on the `Boards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Boards" DROP COLUMN "boardDesription",
ADD COLUMN     "boardDescription" TEXT;
