-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'trener', 'clen_spolku_hrac', 'neclen_spolku_hrac', 'hrac_z_jineho_klubu', 'zajemce');

-- CreateEnum
CREATE TYPE "postType" AS ENUM ('event', 'text', 'survey');

-- CreateEnum
CREATE TYPE "eventType" AS ENUM ('trenink', 'kurz_pro_mladez', 'turnaj', 'jednorazova_akce');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "last_signed_in" TIMESTAMP(3),
    "facebook" TEXT,
    "instagram" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "userId" INTEGER NOT NULL,
    "email_notification" BOOLEAN NOT NULL DEFAULT true,
    "push_notification" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Reward_system" (
    "userId" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Reward_system_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "type" "postType" NOT NULL,
    "heading" TEXT NOT NULL,
    "text" TEXT,
    "time_of_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post_comment" (
    "id" SERIAL NOT NULL,
    "time_of_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" "eventType" NOT NULL,
    "price" INTEGER,
    "time" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "people_limit" INTEGER,
    "substitues_limit" INTEGER,
    "note" TEXT,
    "address_short" TEXT,
    "organiserId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "address_lat" TEXT,
    "address_lng" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "userId" INTEGER,
    "postId" INTEGER,
    "albumId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey_option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Survey_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_post_likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user-post_notification" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Post_comment_likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user-on-event" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_users-in-event-teams" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_image_tagged_users" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_voted_survey_option" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user_in_group" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_post_in_group" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_postId_key" ON "Event"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_post_likes_AB_unique" ON "_post_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_post_likes_B_index" ON "_post_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user-post_notification_AB_unique" ON "_user-post_notification"("A", "B");

-- CreateIndex
CREATE INDEX "_user-post_notification_B_index" ON "_user-post_notification"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Post_comment_likes_AB_unique" ON "_Post_comment_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_Post_comment_likes_B_index" ON "_Post_comment_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user-on-event_AB_unique" ON "_user-on-event"("A", "B");

-- CreateIndex
CREATE INDEX "_user-on-event_B_index" ON "_user-on-event"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_users-in-event-teams_AB_unique" ON "_users-in-event-teams"("A", "B");

-- CreateIndex
CREATE INDEX "_users-in-event-teams_B_index" ON "_users-in-event-teams"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_image_tagged_users_AB_unique" ON "_image_tagged_users"("A", "B");

-- CreateIndex
CREATE INDEX "_image_tagged_users_B_index" ON "_image_tagged_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_voted_survey_option_AB_unique" ON "_voted_survey_option"("A", "B");

-- CreateIndex
CREATE INDEX "_voted_survey_option_B_index" ON "_voted_survey_option"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user_in_group_AB_unique" ON "_user_in_group"("A", "B");

-- CreateIndex
CREATE INDEX "_user_in_group_B_index" ON "_user_in_group"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_post_in_group_AB_unique" ON "_post_in_group"("A", "B");

-- CreateIndex
CREATE INDEX "_post_in_group_B_index" ON "_post_in_group"("B");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward_system" ADD CONSTRAINT "Reward_system_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_comment" ADD CONSTRAINT "Post_comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_comment" ADD CONSTRAINT "Post_comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organiserId_fkey" FOREIGN KEY ("organiserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_option" ADD CONSTRAINT "Survey_option_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_likes" ADD CONSTRAINT "_post_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_likes" ADD CONSTRAINT "_post_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-post_notification" ADD CONSTRAINT "_user-post_notification_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-post_notification" ADD CONSTRAINT "_user-post_notification_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_comment_likes" ADD CONSTRAINT "_Post_comment_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_comment_likes" ADD CONSTRAINT "_Post_comment_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-on-event" ADD CONSTRAINT "_user-on-event_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-on-event" ADD CONSTRAINT "_user-on-event_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users-in-event-teams" ADD CONSTRAINT "_users-in-event-teams_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users-in-event-teams" ADD CONSTRAINT "_users-in-event-teams_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_image_tagged_users" ADD CONSTRAINT "_image_tagged_users_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_image_tagged_users" ADD CONSTRAINT "_image_tagged_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_voted_survey_option" ADD CONSTRAINT "_voted_survey_option_A_fkey" FOREIGN KEY ("A") REFERENCES "Survey_option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_voted_survey_option" ADD CONSTRAINT "_voted_survey_option_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_in_group" ADD CONSTRAINT "_user_in_group_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_in_group" ADD CONSTRAINT "_user_in_group_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_in_group" ADD CONSTRAINT "_post_in_group_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post_in_group" ADD CONSTRAINT "_post_in_group_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
