-- CreateTable
CREATE TABLE "_event_in_grup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_event_in_grup_AB_unique" ON "_event_in_grup"("A", "B");

-- CreateIndex
CREATE INDEX "_event_in_grup_B_index" ON "_event_in_grup"("B");

-- AddForeignKey
ALTER TABLE "_event_in_grup" ADD CONSTRAINT "_event_in_grup_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_event_in_grup" ADD CONSTRAINT "_event_in_grup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
