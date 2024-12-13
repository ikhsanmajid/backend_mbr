/*
  Warnings:

  - You are about to drop the column `nomorBatch` on the `detailpermintaanmbr` table. All the data in the column will be lost.
  - You are about to drop the column `nomorUrut` on the `detailpermintaanmbr` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `detailpermintaanmbr` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalKembali` on the `detailpermintaanmbr` table. All the data in the column will be lost.
  - You are about to drop the column `userTerima` on the `detailpermintaanmbr` table. All the data in the column will be lost.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `idProduk` to the `detailpermintaanmbr` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorMBR` to the `detailpermintaanmbr` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detailpermintaanmbr` DROP FOREIGN KEY `detailpermintaanmbr_userTerima_fkey`;

-- AlterTable
ALTER TABLE `detailpermintaanmbr` DROP COLUMN `nomorBatch`,
    DROP COLUMN `nomorUrut`,
    DROP COLUMN `status`,
    DROP COLUMN `tanggalKembali`,
    DROP COLUMN `userTerima`,
    ADD COLUMN `idProduk` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `nomorMBR` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `permintaan` ADD COLUMN `status` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',
    MODIFY `timeCreated` DATETIME NULL;

-- CreateTable
CREATE TABLE `nomormbr` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idDetailPermintaan` INTEGER UNSIGNED NOT NULL,
    `nomorUrut` VARCHAR(6) NOT NULL,
    `status` ENUM('ACTIVE', 'KEMBALI', 'BATAL') NOT NULL DEFAULT 'ACTIVE',
    `tanggalKembali` DATETIME NULL,
    `idUserTerima` INTEGER UNSIGNED NULL,
    `nomorBatch` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detailpermintaanmbr` ADD CONSTRAINT `detailpermintaanmbr_idProduk_fkey` FOREIGN KEY (`idProduk`) REFERENCES `produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nomormbr` ADD CONSTRAINT `nomormbr_idUserTerima_fkey` FOREIGN KEY (`idUserTerima`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nomormbr` ADD CONSTRAINT `nomormbr_idDetailPermintaan_fkey` FOREIGN KEY (`idDetailPermintaan`) REFERENCES `detailpermintaanmbr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
