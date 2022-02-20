/*
  Warnings:

  - You are about to drop the column `nameEnd` on the `merchantcategory` table. All the data in the column will be lost.
  - You are about to drop the column `nameEnd` on the `merchantsector` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[englishName]` on the table `MerchantCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[englishName]` on the table `MerchantSector` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `englishName` to the `MerchantCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `MerchantSector` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `MerchantCategory_nameEnd_key` ON `merchantcategory`;

-- DropIndex
DROP INDEX `MerchantSector_nameEnd_key` ON `merchantsector`;

-- AlterTable
ALTER TABLE `merchantcategory` DROP COLUMN `nameEnd`,
    ADD COLUMN `englishName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchantsector` DROP COLUMN `nameEnd`,
    ADD COLUMN `englishName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MerchantCategory_englishName_key` ON `MerchantCategory`(`englishName`);

-- CreateIndex
CREATE UNIQUE INDEX `MerchantSector_englishName_key` ON `MerchantSector`(`englishName`);
