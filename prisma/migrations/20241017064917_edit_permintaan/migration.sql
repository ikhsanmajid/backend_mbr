/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `idCreated` on table `permintaan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `permintaan` DROP FOREIGN KEY `permintaan_idCreated_fkey`;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `idCreated` INTEGER UNSIGNED NOT NULL,
    MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `permintaan` ADD CONSTRAINT `permintaan_idCreated_fkey` FOREIGN KEY (`idCreated`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
