/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `nomormbr` DROP FOREIGN KEY `nomormbr_idDetailPermintaan_fkey`;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `nomormbr` ADD CONSTRAINT `nomormbr_idDetailPermintaan_fkey` FOREIGN KEY (`idDetailPermintaan`) REFERENCES `detailpermintaanmbr`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
