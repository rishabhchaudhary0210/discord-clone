/*
  Warnings:

  - You are about to drop the column `udpatedAt` on the `DirectMessage` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "udpatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
