/*
  Warnings:

  - Added the required column `installments` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paypermonth` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `installments` INTEGER NOT NULL,
    ADD COLUMN `paypermonth` INTEGER NOT NULL;
