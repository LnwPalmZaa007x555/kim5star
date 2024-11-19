/*
  Warnings:

  - Added the required column `bookingId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `bookingId` INTEGER NOT NULL;
