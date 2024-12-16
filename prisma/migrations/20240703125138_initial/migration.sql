-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `dateCreated` DATE NOT NULL,

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permintaan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idCreated` INTEGER UNSIGNED NULL,
    `timeCreated` DATETIME NULL,
    `idConfirmed` INTEGER UNSIGNED NULL,
    `timeConfirmed` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bagian` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `namaBagian` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `bagian_namaBagian_key`(`namaBagian`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jabatan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `namaJabatan` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `jabatan_namaJabatan_key`(`namaJabatan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bagianonjabatan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idBagian` INTEGER UNSIGNED NOT NULL,
    `idJabatan` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersonbagianonjabatan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idBagianJabatan` INTEGER UNSIGNED NOT NULL,
    `idUsers` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permintaanonmbr` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idPermintaan` INTEGER UNSIGNED NOT NULL,
    `idProdukMbr` INTEGER UNSIGNED NOT NULL,
    `minNumber` INTEGER NOT NULL,
    `maxNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mbr` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `noMbr` VARCHAR(255) NOT NULL,
    `tanggalTerbit` DATE NOT NULL,
    `expiredDate` DATE NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `replacedBy` INTEGER UNSIGNED NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `mbr_id_key`(`id`),
    UNIQUE INDEX `mbr_noMbr_key`(`noMbr`),
    PRIMARY KEY (`id`, `noMbr`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `namaProduk` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `namaKategori` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `kategori_namaKategori_key`(`namaKategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategorionproduk` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idProduk` INTEGER UNSIGNED NOT NULL,
    `idKategori` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategorionprodukonmbr` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idMbr` INTEGER UNSIGNED NOT NULL,
    `idKategoriProduk` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailpermintaanmbr` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idPermintaanMbr` INTEGER UNSIGNED NOT NULL,
    `nomorUrut` INTEGER NOT NULL,
    `nomorBatch` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'KEMBALI', 'BATAL') NOT NULL DEFAULT 'ACTIVE',
    `tanggalKembali` DATETIME NULL,
    `userTerima` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bagianonproduk` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idKategoriProduk` INTEGER UNSIGNED NOT NULL,
    `idBagian` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `permintaan` ADD CONSTRAINT `permintaan_idCreated_fkey` FOREIGN KEY (`idCreated`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permintaan` ADD CONSTRAINT `permintaan_idConfirmed_fkey` FOREIGN KEY (`idConfirmed`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bagianonjabatan` ADD CONSTRAINT `bagianonjabatan_idBagian_fkey` FOREIGN KEY (`idBagian`) REFERENCES `bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bagianonjabatan` ADD CONSTRAINT `bagianonjabatan_idJabatan_fkey` FOREIGN KEY (`idJabatan`) REFERENCES `jabatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersonbagianonjabatan` ADD CONSTRAINT `usersonbagianonjabatan_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersonbagianonjabatan` ADD CONSTRAINT `usersonbagianonjabatan_idBagianJabatan_fkey` FOREIGN KEY (`idBagianJabatan`) REFERENCES `bagianonjabatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permintaanonmbr` ADD CONSTRAINT `permintaanonmbr_idPermintaan_fkey` FOREIGN KEY (`idPermintaan`) REFERENCES `permintaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permintaanonmbr` ADD CONSTRAINT `permintaanonmbr_idProdukMbr_fkey` FOREIGN KEY (`idProdukMbr`) REFERENCES `kategorionprodukonmbr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mbr` ADD CONSTRAINT `mbr_replacedBy_fkey` FOREIGN KEY (`replacedBy`) REFERENCES `mbr`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorionproduk` ADD CONSTRAINT `kategorionproduk_idProduk_fkey` FOREIGN KEY (`idProduk`) REFERENCES `produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorionproduk` ADD CONSTRAINT `kategorionproduk_idKategori_fkey` FOREIGN KEY (`idKategori`) REFERENCES `kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorionprodukonmbr` ADD CONSTRAINT `kategorionprodukonmbr_idKategoriProduk_fkey` FOREIGN KEY (`idKategoriProduk`) REFERENCES `kategorionproduk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorionprodukonmbr` ADD CONSTRAINT `kategorionprodukonmbr_idMbr_fkey` FOREIGN KEY (`idMbr`) REFERENCES `mbr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpermintaanmbr` ADD CONSTRAINT `detailpermintaanmbr_userTerima_fkey` FOREIGN KEY (`userTerima`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpermintaanmbr` ADD CONSTRAINT `detailpermintaanmbr_idPermintaanMbr_fkey` FOREIGN KEY (`idPermintaanMbr`) REFERENCES `permintaanonmbr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bagianonproduk` ADD CONSTRAINT `bagianonproduk_idKategoriProduk_fkey` FOREIGN KEY (`idKategoriProduk`) REFERENCES `kategorionproduk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bagianonproduk` ADD CONSTRAINT `bagianonproduk_idBagian_fkey` FOREIGN KEY (`idBagian`) REFERENCES `bagian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
