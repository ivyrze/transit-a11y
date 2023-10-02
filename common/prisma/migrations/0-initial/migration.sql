-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bounds" DOUBLE PRECISION[],
    "vehicle" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Geometry" (
    "id" TEXT NOT NULL,
    "geojson" JSONB NOT NULL,

    CONSTRAINT "Geometry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "invite" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "accessibility" TEXT[],
    "comments" TEXT,
    "tags" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAttachment" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "sizes" JSONB NOT NULL,

    CONSTRAINT "ReviewAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteDirection" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,

    CONSTRAINT "RouteDirection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteDirectionSegment" (
    "id" SERIAL NOT NULL,
    "directionId" INTEGER NOT NULL,

    CONSTRAINT "RouteDirectionSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteDirectionBranch" (
    "id" SERIAL NOT NULL,
    "segmentId" INTEGER NOT NULL,

    CONSTRAINT "RouteDirectionBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coordinates" DOUBLE PRECISION[],
    "major" BOOLEAN,
    "accessibility" TEXT NOT NULL,
    "tags" TEXT[],
    "url" TEXT,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RouteDirectionBranchToStop" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_invite_key" ON "Invite"("invite");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_RouteDirectionBranchToStop_AB_unique" ON "_RouteDirectionBranchToStop"("A", "B");

-- CreateIndex
CREATE INDEX "_RouteDirectionBranchToStop_B_index" ON "_RouteDirectionBranchToStop"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAttachment" ADD CONSTRAINT "ReviewAttachment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteDirection" ADD CONSTRAINT "RouteDirection_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteDirectionSegment" ADD CONSTRAINT "RouteDirectionSegment_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "RouteDirection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteDirectionBranch" ADD CONSTRAINT "RouteDirectionBranch_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "RouteDirectionSegment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteDirectionBranchToStop" ADD CONSTRAINT "_RouteDirectionBranchToStop_A_fkey" FOREIGN KEY ("A") REFERENCES "RouteDirectionBranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteDirectionBranchToStop" ADD CONSTRAINT "_RouteDirectionBranchToStop_B_fkey" FOREIGN KEY ("B") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

