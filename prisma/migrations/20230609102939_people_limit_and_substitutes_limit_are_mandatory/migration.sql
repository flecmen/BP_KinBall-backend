/*
  Warnings:

  - Made the column `people_limit` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `substitues_limit` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "people_limit" SET NOT NULL,
ALTER COLUMN "substitues_limit" SET NOT NULL;
