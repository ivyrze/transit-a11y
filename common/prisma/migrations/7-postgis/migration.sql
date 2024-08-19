/*
  Warnings:

  - You are about to drop the `Geometry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shapes` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "shapes" JSONB NOT NULL,
ADD COLUMN     "geometry" geometry GENERATED ALWAYS AS (ST_Transform(ST_GeomFromGeoJSON(shapes), 3857)) STORED;

-- AlterTable
ALTER TABLE "Stop" ADD COLUMN     "geometry" geometry GENERATED ALWAYS AS (ST_Transform(ST_Point(coordinates[1], coordinates[2], 4326), 3857)) STORED;

-- DropTable
DROP TABLE "Geometry";
