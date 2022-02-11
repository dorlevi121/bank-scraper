/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateUpdated` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dateUpdated` DATETIME(3) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `hashedPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `TransactionCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `currencyCode` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `merchantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `merchantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Merchant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `sectorId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `Merchant_name_key`(`name`),
    UNIQUE INDEX `Merchant_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantSector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameEnd` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MerchantSector_name_key`(`name`),
    UNIQUE INDEX `MerchantSector_nameEnd_key`(`nameEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameEnd` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MerchantCategory_name_key`(`name`),
    UNIQUE INDEX `MerchantCategory_nameEnd_key`(`nameEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- AddForeignKey
ALTER TABLE `TransactionCard` ADD CONSTRAINT `TransactionCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionCard` ADD CONSTRAINT `TransactionCard_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `Merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionAccount` ADD CONSTRAINT `TransactionAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionAccount` ADD CONSTRAINT `TransactionAccount_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `Merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `MerchantSector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MerchantCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
