/*
  Warnings:

  - A unique constraint covering the columns `[identityCard]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bank_identityCard_key` ON `Bank`(`identityCard`);
