/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeConfirmed` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `nomormbr` ADD COLUMN `idUserKembali` INTEGER UNSIGNED NULL,
    MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL,
    MODIFY `timeConfirmed` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `nomormbr` ADD CONSTRAINT `nomormbr_idUserKembali_fkey` FOREIGN KEY (`idUserKembali`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
