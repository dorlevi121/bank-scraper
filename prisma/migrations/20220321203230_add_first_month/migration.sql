/*
  Warnings:

  - Added the required column `firstTransactionOfMonth` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `firstTransactionOfMonth` VARCHAR(191) NOT NULL;
