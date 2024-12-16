/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `detailpermintaanmbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `isActive` on the `kategori` table. All the data in the column will be lost.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `isActive` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the `bagianonproduk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategorionproduk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategorionprodukonmbr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permintaanonmbr` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `startingNumber` to the `kategori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idBagian` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idKategori` to the `produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bagianonproduk` DROP FOREIGN KEY `bagianonproduk_idBagian_fkey`;

-- DropForeignKey
ALTER TABLE `bagianonproduk` DROP FOREIGN KEY `bagianonproduk_idKategoriProduk_fkey`;

-- DropForeignKey
ALTER TABLE `detailpermintaanmbr` DROP FOREIGN KEY `detailpermintaanmbr_idPermintaanMbr_fkey`;

-- DropForeignKey
ALTER TABLE `kategorionproduk` DROP FOREIGN KEY `kategorionproduk_idKategori_fkey`;

-- DropForeignKey
ALTER TABLE `kategorionproduk` DROP FOREIGN KEY `kategorionproduk_idProduk_fkey`;

-- DropForeignKey
ALTER TABLE `kategorionprodukonmbr` DROP FOREIGN KEY `kategorionprodukonmbr_idKategoriProduk_fkey`;

-- DropForeignKey
ALTER TABLE `kategorionprodukonmbr` DROP FOREIGN KEY `kategorionprodukonmbr_idMbr_fkey`;

-- DropForeignKey
ALTER TABLE `mbr` DROP FOREIGN KEY `mbr_replacedBy_fkey`;

-- DropForeignKey
ALTER TABLE `permintaanonmbr` DROP FOREIGN KEY `permintaanonmbr_idPermintaan_fkey`;

-- DropForeignKey
ALTER TABLE `permintaanonmbr` DROP FOREIGN KEY `permintaanonmbr_idProdukMbr_fkey`;

-- AlterTable
ALTER TABLE `detailpermintaanmbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `kategori` DROP COLUMN `isActive`,
    ADD COLUMN `startingNumber` VARCHAR(6) NOT NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- AlterTable
ALTER TABLE `produk` DROP COLUMN `isActive`,
    ADD COLUMN `idBagian` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `idKategori` INTEGER UNSIGNED NOT NULL;

-- DropTable
DROP TABLE `bagianonproduk`;

-- DropTable
DROP TABLE `kategorionproduk`;

-- DropTable
DROP TABLE `kategorionprodukonmbr`;

-- DropTable
DROP TABLE `mbr`;

-- DropTable
DROP TABLE `permintaanonmbr`;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_idKategori_fkey` FOREIGN KEY (`idKategori`) REFERENCES `kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_idBagian_fkey` FOREIGN KEY (`idBagian`) REFERENCES `bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
