/*
  Warnings:

  - A unique constraint covering the columns `[projectName,clientName]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_clientName_key" ON "Projects"("projectName", "clientName");
