-- CreateTable
CREATE TABLE "Boards" (
    "boardId" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "boardAssigner" TEXT NOT NULL,
    "boardDesription" TEXT,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("boardId")
);
