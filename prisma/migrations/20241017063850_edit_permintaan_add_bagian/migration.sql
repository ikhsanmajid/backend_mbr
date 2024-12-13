/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `idBagianCreated` to the `permintaan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` ADD COLUMN `idBagianCreated` INTEGER UNSIGNED NOT NULL,
    MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `permintaan` ADD CONSTRAINT `permintaan_idBagianCreated_fkey` FOREIGN KEY (`idBagianCreated`) REFERENCES `bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
