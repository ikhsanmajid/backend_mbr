-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'KEMBALI', 'BATAL');

-- CreateEnum
CREATE TYPE "Konfirmasi" AS ENUM ('PENDING', 'DITERIMA', 'DITOLAK');

-- CreateEnum
CREATE TYPE "TipeMBR" AS ENUM ('PO', 'PS');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "dateCreated" DATE NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id","email","nik")
);

-- CreateTable
CREATE TABLE "permintaan" (
    "id" BIGSERIAL NOT NULL,
    "idCreated" INTEGER NOT NULL,
    "idBagianCreated" INTEGER NOT NULL,
    "timeCreated" TIMESTAMP,
    "status" "Konfirmasi" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "idConfirmed" INTEGER,
    "timeConfirmed" TIMESTAMP,

    CONSTRAINT "permintaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bagian" (
    "id" SERIAL NOT NULL,
    "namaBagian" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "idJenisBagian" INTEGER NOT NULL,

    CONSTRAINT "bagian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_bagian" (
    "id" SERIAL NOT NULL,
    "namaJenisBagian" VARCHAR(255) NOT NULL,

    CONSTRAINT "jenis_bagian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id" SERIAL NOT NULL,
    "namaJabatan" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bagianonjabatan" (
    "id" SERIAL NOT NULL,
    "idBagian" INTEGER NOT NULL,
    "idJabatan" INTEGER NOT NULL,

    CONSTRAINT "bagianonjabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usersonbagianonjabatan" (
    "id" SERIAL NOT NULL,
    "idBagianJabatan" INTEGER NOT NULL,
    "idUsers" INTEGER NOT NULL,

    CONSTRAINT "usersonbagianonjabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" SERIAL NOT NULL,
    "namaProduk" VARCHAR(255) NOT NULL,
    "idKategori" INTEGER NOT NULL,
    "idBagian" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori" (
    "id" SERIAL NOT NULL,
    "namaKategori" VARCHAR(255) NOT NULL,
    "startingNumber" VARCHAR(6) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailpermintaanmbr" (
    "id" BIGSERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "idPermintaanMbr" BIGINT NOT NULL,
    "idProduk" INTEGER NOT NULL,
    "nomorMBR" VARCHAR(36) NOT NULL,
    "tipeMBR" "TipeMBR" NOT NULL DEFAULT 'PO',
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "detailpermintaanmbr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nomormbr" (
    "id" BIGSERIAL NOT NULL,
    "idDetailPermintaan" BIGINT NOT NULL,
    "nomorUrut" VARCHAR(6) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "idUserKembali" INTEGER,
    "tahun" INTEGER NOT NULL,
    "tanggalKembali" TIMESTAMP,
    "idUserTerima" INTEGER,
    "nomorBatch" VARCHAR(10),

    CONSTRAINT "nomormbr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bagian_namaBagian_key" ON "bagian"("namaBagian");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_bagian_namaJenisBagian_key" ON "jenis_bagian"("namaJenisBagian");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_namaJabatan_key" ON "jabatan"("namaJabatan");

-- CreateIndex
CREATE UNIQUE INDEX "bagianonjabatan_idBagian_idJabatan_key" ON "bagianonjabatan"("idBagian", "idJabatan");

-- CreateIndex
CREATE UNIQUE INDEX "usersonbagianonjabatan_idBagianJabatan_idUsers_key" ON "usersonbagianonjabatan"("idBagianJabatan", "idUsers");

-- CreateIndex
CREATE UNIQUE INDEX "produk_namaProduk_idKategori_idBagian_key" ON "produk"("namaProduk", "idKategori", "idBagian");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_namaKategori_key" ON "kategori"("namaKategori");

-- CreateIndex
CREATE UNIQUE INDEX "nomormbr_idDetailPermintaan_nomorUrut_tahun_key" ON "nomormbr"("idDetailPermintaan", "nomorUrut", "tahun");

-- AddForeignKey
ALTER TABLE "permintaan" ADD CONSTRAINT "permintaan_idBagianCreated_fkey" FOREIGN KEY ("idBagianCreated") REFERENCES "bagian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan" ADD CONSTRAINT "permintaan_idCreated_fkey" FOREIGN KEY ("idCreated") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan" ADD CONSTRAINT "permintaan_idConfirmed_fkey" FOREIGN KEY ("idConfirmed") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagian" ADD CONSTRAINT "bagian_idJenisBagian_fkey" FOREIGN KEY ("idJenisBagian") REFERENCES "jenis_bagian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagianonjabatan" ADD CONSTRAINT "bagianonjabatan_idBagian_fkey" FOREIGN KEY ("idBagian") REFERENCES "bagian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagianonjabatan" ADD CONSTRAINT "bagianonjabatan_idJabatan_fkey" FOREIGN KEY ("idJabatan") REFERENCES "jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersonbagianonjabatan" ADD CONSTRAINT "usersonbagianonjabatan_idUsers_fkey" FOREIGN KEY ("idUsers") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersonbagianonjabatan" ADD CONSTRAINT "usersonbagianonjabatan_idBagianJabatan_fkey" FOREIGN KEY ("idBagianJabatan") REFERENCES "bagianonjabatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_idKategori_fkey" FOREIGN KEY ("idKategori") REFERENCES "kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_idBagian_fkey" FOREIGN KEY ("idBagian") REFERENCES "bagian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailpermintaanmbr" ADD CONSTRAINT "detailpermintaanmbr_idProduk_fkey" FOREIGN KEY ("idProduk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailpermintaanmbr" ADD CONSTRAINT "detailpermintaanmbr_idPermintaanMbr_fkey" FOREIGN KEY ("idPermintaanMbr") REFERENCES "permintaan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomormbr" ADD CONSTRAINT "nomormbr_idUserKembali_fkey" FOREIGN KEY ("idUserKembali") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomormbr" ADD CONSTRAINT "nomormbr_idUserTerima_fkey" FOREIGN KEY ("idUserTerima") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomormbr" ADD CONSTRAINT "nomormbr_idDetailPermintaan_fkey" FOREIGN KEY ("idDetailPermintaan") REFERENCES "detailpermintaanmbr"("id") ON DELETE CASCADE ON UPDATE CASCADE;
