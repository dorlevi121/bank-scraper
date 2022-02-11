/*
  Warnings:

  - Added the required column `bankCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `bankCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `bankId` VARCHAR(191) NOT NULL,
    ADD COLUMN `bankPassword` VARCHAR(191) NOT NULL;
