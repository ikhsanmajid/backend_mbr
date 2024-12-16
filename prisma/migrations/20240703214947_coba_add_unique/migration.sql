/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `detailpermintaanmbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[idBagian,idJabatan]` on the table `bagianonjabatan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `detailpermintaanmbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `bagianonjabatan_idBagian_idJabatan_key` ON `bagianonjabatan`(`idBagian`, `idJabatan`);
