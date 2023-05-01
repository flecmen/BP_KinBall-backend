/*
  Warnings:

  - The values [substitue] on the enum `UserOnEventStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [trener,clen_spolku_hrac,neclen_spolku_hrac,hrac_z_jineho_klubu,zajemce] on the enum `role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserOnEventStatus_new" AS ENUM ('going', 'not_going', 'dont_know', 'substitute');
ALTER TABLE "UserOnEvent" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserOnEvent" ALTER COLUMN "status" TYPE "UserOnEventStatus_new" USING ("status"::text::"UserOnEventStatus_new");
ALTER TYPE "UserOnEventStatus" RENAME TO "UserOnEventStatus_old";
ALTER TYPE "UserOnEventStatus_new" RENAME TO "UserOnEventStatus";
DROP TYPE "UserOnEventStatus_old";
ALTER TABLE "UserOnEvent" ALTER COLUMN "status" SET DEFAULT 'going';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('admin', 'coach', 'player');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "role_new" USING ("role"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
COMMIT;
