/*
  Warnings:

  - You are about to drop the `transactionaccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactioncard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transactionaccount` DROP FOREIGN KEY `TransactionAccount_merchantName_fkey`;

-- DropForeignKey
ALTER TABLE `transactionaccount` DROP FOREIGN KEY `TransactionAccount_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transactioncard` DROP FOREIGN KEY `TransactionCard_merchantName_fkey`;

-- DropForeignKey
ALTER TABLE `transactioncard` DROP FOREIGN KEY `TransactionCard_userId_fkey`;

-- DropTable
DROP TABLE `transactionaccount`;

-- DropTable
DROP TABLE `transactioncard`;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `amount` VARCHAR(191) NOT NULL,
    `merchantName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_merchantName_fkey` FOREIGN KEY (`merchantName`) REFERENCES `Merchant`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
