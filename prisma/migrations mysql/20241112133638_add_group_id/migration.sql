/*
  Warnings:

  - You are about to alter the column `tanggalKembali` on the `nomormbr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timeCreated` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `group_id` to the `detailpermintaanmbr` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detailpermintaanmbr` ADD COLUMN `group_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `nomormbr` MODIFY `tanggalKembali` DATETIME NULL;

-- AlterTable
ALTER TABLE `permintaan` MODIFY `timeCreated` DATETIME NULL;
