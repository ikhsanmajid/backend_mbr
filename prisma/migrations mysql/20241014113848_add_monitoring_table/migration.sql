/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- CreateTable
CREATE TABLE `department_monitored` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idBagian` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `department_monitored` ADD CONSTRAINT `department_monitored_idBagian_fkey` FOREIGN KEY (`idBagian`) REFERENCES `bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
