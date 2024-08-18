/*
  Warnings:

  - You are about to drop the column `accessibility` on the `Stop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stop" DROP COLUMN "accessibility";

-- CreateTable
CREATE TABLE "Accessibility" (
    "stopId" TEXT NOT NULL,
    "reviews" TEXT NOT NULL DEFAULT 'unknown',
    "agency" TEXT NOT NULL DEFAULT 'unknown'
);

-- CreateIndex
CREATE UNIQUE INDEX "Accessibility_stopId_key" ON "Accessibility"("stopId");

-- AddForeignKey
ALTER TABLE "Accessibility" ADD CONSTRAINT "Accessibility_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
