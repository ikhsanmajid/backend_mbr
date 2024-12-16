/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[idDetailPermintaan,nomorUrut,tahun]` on the table `nomormbr` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `nomormbr_nomorUrut_tahun_key` ON `nomormbr`;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `nomormbr_idDetailPermintaan_nomorUrut_tahun_key` ON `nomormbr`(`idDetailPermintaan`, `nomorUrut`, `tahun`);
