/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `detailpermintaanmbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `usersonbagianonjabatan` DROP FOREIGN KEY `usersonbagianonjabatan_idUsers_fkey`;

-- AlterTable
ALTER TABLE `detailpermintaanmbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `nama` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `usersonbagianonjabatan` ADD CONSTRAINT `usersonbagianonjabatan_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
