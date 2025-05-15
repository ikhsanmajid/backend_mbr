/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` ADD COLUMN `reason` VARCHAR(191) NULL,
    MODIFY `timeCreated` DATETIME NULL;
