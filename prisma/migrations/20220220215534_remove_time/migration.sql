-- DropForeignKey
ALTER TABLE `merchant` DROP FOREIGN KEY `Merchant_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `merchant` DROP FOREIGN KEY `Merchant_sectorId_fkey`;

-- AlterTable
ALTER TABLE `merchant` MODIFY `sectorId` INTEGER NULL,
    MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `MerchantSector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MerchantCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
