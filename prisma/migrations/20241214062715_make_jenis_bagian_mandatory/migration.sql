/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `idJenisBagian` on table `bagian` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `bagian` DROP FOREIGN KEY `bagian_idJenisBagian_fkey`;

-- AlterTable
ALTER TABLE `bagian` MODIFY `idJenisBagian` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `bagian` ADD CONSTRAINT `bagian_idJenisBagian_fkey` FOREIGN KEY (`idJenisBagian`) REFERENCES `jenis_bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
