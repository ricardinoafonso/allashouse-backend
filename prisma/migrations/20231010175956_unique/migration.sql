/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "token_usersId_key" ON "token"("usersId");
