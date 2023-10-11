-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_usersId_fkey";

-- DropIndex
DROP INDEX "token_usersId_key";

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "usersId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
