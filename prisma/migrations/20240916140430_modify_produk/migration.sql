/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `detailpermintaanmbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[namaProduk,idKategori,idBagian]` on the table `produk` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `detailpermintaanmbr_idPermintaanMbr_fkey` ON `detailpermintaanmbr`;

-- AlterTable
ALTER TABLE `detailpermintaanmbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `produk_namaProduk_idKategori_idBagian_key` ON `produk`(`namaProduk`, `idKategori`, `idBagian`);
