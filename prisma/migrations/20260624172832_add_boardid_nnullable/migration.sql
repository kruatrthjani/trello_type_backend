-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "boardId" TEXT;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE CASCADE ON UPDATE CASCADE;
