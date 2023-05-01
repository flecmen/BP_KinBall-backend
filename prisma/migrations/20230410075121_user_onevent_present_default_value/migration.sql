/*
  Warnings:

  - Made the column `present` on table `UserOnEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserOnEvent" ALTER COLUMN "present" SET NOT NULL,
ALTER COLUMN "present" SET DEFAULT false;
