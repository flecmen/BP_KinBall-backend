/*
  Warnings:

  - You are about to drop the column `attendance_confirmation` on the `UserOnEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOnEvent" DROP COLUMN "attendance_confirmation",
ADD COLUMN     "present" BOOLEAN;
