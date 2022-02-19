/*
  Warnings:

  - You are about to drop the column `bankCode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `bankPassword` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bankCode`,
    DROP COLUMN `bankId`,
    DROP COLUMN `bankPassword`;

-- CreateTable
CREATE TABLE `Bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `identityCard` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `Bank_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bank` ADD CONSTRAINT `Bank_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
