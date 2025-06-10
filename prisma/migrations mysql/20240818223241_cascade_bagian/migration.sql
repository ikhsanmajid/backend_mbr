/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `detailpermintaanmbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `bagianonjabatan` DROP FOREIGN KEY `bagianonjabatan_idBagian_fkey`;

-- DropForeignKey
ALTER TABLE `usersonbagianonjabatan` DROP FOREIGN KEY `usersonbagianonjabatan_idBagianJabatan_fkey`;

-- AlterTable
ALTER TABLE `detailpermintaanmbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `bagianonjabatan` ADD CONSTRAINT `bagianonjabatan_idBagian_fkey` FOREIGN KEY (`idBagian`) REFERENCES `bagian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersonbagianonjabatan` ADD CONSTRAINT `usersonbagianonjabatan_idBagianJabatan_fkey` FOREIGN KEY (`idBagianJabatan`) REFERENCES `bagianonjabatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
