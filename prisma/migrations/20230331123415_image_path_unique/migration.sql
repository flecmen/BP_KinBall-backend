/*
  Warnings:

  - A unique constraint covering the columns `[image_path]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_image_path_key" ON "Image"("image_path");
