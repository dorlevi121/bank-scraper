/*
  Warnings:

  - You are about to drop the column `merchantId` on the `transactioncard` table. All the data in the column will be lost.
  - Added the required column `merchantName` to the `TransactionCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transactioncard` DROP FOREIGN KEY `TransactionCard_merchantId_fkey`;

-- AlterTable
ALTER TABLE `transactioncard` DROP COLUMN `merchantId`,
    ADD COLUMN `merchantName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TransactionCard` ADD CONSTRAINT `TransactionCard_merchantName_fkey` FOREIGN KEY (`merchantName`) REFERENCES `Merchant`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
