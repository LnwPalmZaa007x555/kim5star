/*
  Warnings:

  - Added the required column `gender` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `gender` VARCHAR(191) NOT NULL;
