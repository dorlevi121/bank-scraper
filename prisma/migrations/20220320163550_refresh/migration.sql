/*
  Warnings:

  - You are about to drop the column `sectorId` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchantId` on the `transactionaccount` table. All the data in the column will be lost.
  - Added the required column `merchantName` to the `TransactionAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `merchant` DROP FOREIGN KEY `Merchant_sectorId_fkey`;

-- DropForeignKey
ALTER TABLE `transactionaccount` DROP FOREIGN KEY `TransactionAccount_merchantId_fkey`;

-- AlterTable
ALTER TABLE `merchant` DROP COLUMN `sectorId`,
    ADD COLUMN `sectorName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transactionaccount` DROP COLUMN `merchantId`,
    ADD COLUMN `merchantName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TransactionAccount` ADD CONSTRAINT `TransactionAccount_merchantName_fkey` FOREIGN KEY (`merchantName`) REFERENCES `Merchant`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_sectorName_fkey` FOREIGN KEY (`sectorName`) REFERENCES `MerchantSector`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
