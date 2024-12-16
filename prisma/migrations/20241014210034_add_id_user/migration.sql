/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `idUser` to the `department_monitored` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `department_monitored` ADD COLUMN `idUser` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `department_monitored` ADD CONSTRAINT `department_monitored_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
