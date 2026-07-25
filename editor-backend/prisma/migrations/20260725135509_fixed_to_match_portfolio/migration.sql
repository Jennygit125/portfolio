/*
  Warnings:

  - You are about to drop the column `links` on the `Data` table. All the data in the column will be lost.
  - The `imageUrl` column on the `Data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Data" DROP COLUMN "links",
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "otherlinks" TEXT[],
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
