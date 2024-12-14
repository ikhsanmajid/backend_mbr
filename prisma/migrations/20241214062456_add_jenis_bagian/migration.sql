/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `department_monitored` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `department_monitored` DROP FOREIGN KEY `department_monitored_idBagian_fkey`;

-- DropForeignKey
ALTER TABLE `department_monitored` DROP FOREIGN KEY `department_monitored_idUser_fkey`;

-- AlterTable
ALTER TABLE `bagian` ADD COLUMN `idJenisBagian` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- DropTable
DROP TABLE `department_monitored`;

-- CreateTable
CREATE TABLE `jenis_bagian` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `namaJenisBagian` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `jenis_bagian_namaJenisBagian_key`(`namaJenisBagian`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bagian` ADD CONSTRAINT `bagian_idJenisBagian_fkey` FOREIGN KEY (`idJenisBagian`) REFERENCES `jenis_bagian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
