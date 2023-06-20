-- CreateEnum
CREATE TYPE "User_kinball_experience" AS ENUM ('beginner', 'intermediate', 'pro');

-- AlterEnum
ALTER TYPE "role" ADD VALUE 'sub_admin';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "reaction_deadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about_me" TEXT,
ADD COLUMN     "clubId" INTEGER,
ADD COLUMN     "kinball_experience" "User_kinball_experience",
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "phone_number" TEXT,
ALTER COLUMN "role" SET DEFAULT 'player';

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_adminId_key" ON "Club"("adminId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
