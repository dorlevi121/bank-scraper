/*
  Warnings:

  - Made the column `identityCard` on table `bank` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `bank` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `bank` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `bank` MODIFY `identityCard` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `code` VARCHAR(191) NOT NULL;
