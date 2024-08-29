/*
  Warnings:

  - You are about to drop the `_RouteDirectionBranchToStop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RouteDirectionBranchToStop" DROP CONSTRAINT "_RouteDirectionBranchToStop_A_fkey";

-- DropForeignKey
ALTER TABLE "_RouteDirectionBranchToStop" DROP CONSTRAINT "_RouteDirectionBranchToStop_B_fkey";

-- DropTable
DROP TABLE "_RouteDirectionBranchToStop";

-- CreateTable
CREATE TABLE "RouteDirectionStop" (
    "stopId" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "RouteDirectionStop_pkey" PRIMARY KEY ("stopId","branchId","order")
);

-- AddForeignKey
ALTER TABLE "RouteDirectionStop" ADD CONSTRAINT "RouteDirectionStop_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteDirectionStop" ADD CONSTRAINT "RouteDirectionStop_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "RouteDirectionBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
