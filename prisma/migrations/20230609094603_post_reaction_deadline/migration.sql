/*
  Warnings:

  - You are about to drop the column `reaction_deadline` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "reaction_deadline";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "reaction_deadline" TIMESTAMP(3);
