/*
  Warnings:

  - You are about to drop the column `firstTransactionOfMonth` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `transactionMonth` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `firstTransactionOfMonth`,
    ADD COLUMN `transactionMonth` VARCHAR(191) NOT NULL;
