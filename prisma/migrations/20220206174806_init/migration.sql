/*
  Warnings:

  - You are about to drop the column `location` on the `transactioncard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `merchant` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transactionaccount` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transactioncard` DROP COLUMN `location`,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `currencyCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('IN_ACTIVE', 'ACTIVE', 'PENDING') NOT NULL DEFAULT 'PENDING';
