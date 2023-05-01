/*
  Warnings:

  - You are about to drop the `_user-on-event` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `postId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserOnEventStatus" AS ENUM ('going', 'not_going', 'dont_know', 'substitue');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_postId_fkey";

-- DropForeignKey
ALTER TABLE "_user-on-event" DROP CONSTRAINT "_user-on-event_A_fkey";

-- DropForeignKey
ALTER TABLE "_user-on-event" DROP CONSTRAINT "_user-on-event_B_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "postId" SET NOT NULL;

-- DropTable
DROP TABLE "_user-on-event";

-- CreateTable
CREATE TABLE "UserOnEvent" (
    "status" "UserOnEventStatus" NOT NULL DEFAULT 'going',
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "UserOnEvent_pkey" PRIMARY KEY ("userId","eventId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnEvent" ADD CONSTRAINT "UserOnEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnEvent" ADD CONSTRAINT "UserOnEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
