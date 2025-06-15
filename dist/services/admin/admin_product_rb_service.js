"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_category = add_category;
exports.check_category = check_category;
exports.update_kategori = update_kategori;
exports.delete_kategori = delete_kategori;
exports.accept_permintaan = accept_permintaan;
exports.reject_permintaan = reject_permintaan;
exports.get_permintaan = get_permintaan;
exports.get_recap_permintaan = get_recap_permintaan;
exports.get_permintaan_bagian = get_permintaan_bagian;
exports.get_permintaan_produk = get_permintaan_produk;
exports.get_nomor_by_id = get_nomor_by_id;
exports.get_permintaan_by_id = get_permintaan_by_id;
exports.get_nomor_permintaan_by_id = get_nomor_permintaan_by_id;
exports.get_rb_return_by_product = get_rb_return_by_product;
exports.get_rb_return_by_bagian = get_rb_return_by_bagian;
exports.get_rb_return_by_status_outstanding = get_rb_return_by_status_outstanding;
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
exports.confirm_rb_return = confirm_rb_return;
exports.get_laporan_rb_belum_kembali_perbagian = get_laporan_rb_belum_kembali_perbagian;
exports.generate_report_dashboard_admin = generate_report_dashboard_admin;
exports.generate_report_pembuatan_rb = generate_report_pembuatan_rb;
const client_1 = require("@prisma/client");
//SECTION - Product Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Tambah Kategori
function add_category(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const addCategory = yield prisma.kategori.create({
                data: {
                    namaKategori: (_a = data.namaKategori) !== null && _a !== void 0 ? _a : "",
                    startingNumber: (_b = data.startingNumber) !== null && _b !== void 0 ? _b : ""
                },
                select: {
                    id: true,
                    namaKategori: true,
                    startingNumber: true
                }
            });
            return { data: addCategory };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Check Kategori
function check_category(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkCategory = yield prisma.kategori.count({
                where: {
                    namaKategori: data.namaKategori
                }
            });
            return { data: checkCategory };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Update Kategori
function update_kategori(id, putData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateCategory = yield prisma.kategori.update({
                where: {
                    id: Number(id)
                },
                data: {
                    namaKategori: putData.namaKategori,
                    startingNumber: putData.startingNumber
                },
                select: {
                    id: true,
                    namaKategori: true,
                    startingNumber: true
                }
            });
            return { data: updateCategory };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Delete Kategori
function delete_kategori(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteCategory = yield prisma.kategori.delete({
                where: {
                    id: id
                }
            });
            return { data: deleteCategory };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Update Permintaan RB
function accept_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultAcceptPermintaan = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const checkPermintaan = yield tx.permintaan.findFirst({
                    where: {
                        id: parseInt(data.id)
                    },
                    select: {
                        status: true
                    }
                });
                if ((checkPermintaan === null || checkPermintaan === void 0 ? void 0 : checkPermintaan.status) != "PENDING") {
                    throw new Error("Transaksi sudah dikonfirmasi");
                }
                const acceptPermintaan = yield tx.permintaan.update({
                    where: {
                        id: parseInt(data.id)
                    },
                    data: {
                        idConfirmed: parseInt(data.idConfirmed),
                        timeConfirmed: data.timeConfirmed,
                        status: client_1.Konfirmasi["DITERIMA"]
                    },
                    select: {
                        id: true,
                        timeConfirmed: true,
                        idPermintaanUsersCreatedFK: {
                            select: {
                                email: true
                            }
                        },
                        idPermintaanUsersConfirmedFK: {
                            select: {
                                email: true,
                                nama: true,
                            }
                        },
                        status: true
                    }
                });
                const result = {
                    id: Number(acceptPermintaan.id),
                    timeConfirmed: (_a = acceptPermintaan.timeConfirmed) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    status: acceptPermintaan.status,
                    emailCreated: (_b = acceptPermintaan.idPermintaanUsersCreatedFK) === null || _b === void 0 ? void 0 : _b.email,
                    emailConfirmed: (_c = acceptPermintaan.idPermintaanUsersConfirmedFK) === null || _c === void 0 ? void 0 : _c.email,
                    nameConfirmed: (_d = acceptPermintaan.idPermintaanUsersConfirmedFK) === null || _d === void 0 ? void 0 : _d.nama
                };
                const findRB = yield tx.detailpermintaanmbr.findMany({
                    where: {
                        idPermintaanMbr: result.id
                    },
                    select: {
                        idProdukFK: {
                            select: {
                                idKategori: true,
                                idKategoriFK: {
                                    select: {
                                        startingNumber: true
                                    }
                                }, idBagianFK: {
                                    select: {
                                        idJenisBagian: true
                                    }
                                }
                            }
                        },
                        jumlah: true,
                        id: true
                    }
                });
                //console.log(findRB)
                for (const detail of findRB) {
                    const data = Array();
                    const year = new Date().getFullYear();
                    const checkNomor = yield tx.nomormbr.findFirst({
                        where: {
                            idDetailPermintaan: detail.id
                        },
                        select: {
                            id: true
                        }
                    });
                    if (checkNomor !== null) {
                        //console.log(checkNomor)
                        throw new Error("Nomor MBR sudah ada");
                    }
                    const findNomor = yield tx.nomormbr.aggregate({
                        where: {
                            AND: [{
                                    idDetailPermintaanFk: {
                                        idProdukFK: {
                                            idKategori: (_e = detail.idProdukFK) === null || _e === void 0 ? void 0 : _e.idKategori
                                        }
                                    }
                                }, {
                                    tahun: year
                                }, {
                                    idDetailPermintaanFk: {
                                        idProdukFK: {
                                            idBagianFK: {
                                                idJenisBagian: (_g = (_f = detail.idProdukFK) === null || _f === void 0 ? void 0 : _f.idBagianFK) === null || _g === void 0 ? void 0 : _g.idJenisBagian
                                            }
                                        }
                                    }
                                }]
                        },
                        _max: {
                            nomorUrut: true
                        }
                    });
                    if (findNomor._max.nomorUrut != null) {
                        for (let i = 0; i < detail.jumlah; i++) {
                            data.push({
                                idDetailPermintaan: Number(detail.id),
                                nomorUrut: (parseInt(findNomor._max.nomorUrut) + (i + 1)).toString().padStart(6, "0"),
                                status: client_1.Status["ACTIVE"],
                                tahun: year,
                            });
                        }
                    }
                    else {
                        for (let i = 0; i < detail.jumlah; i++) {
                            data.push({
                                idDetailPermintaan: Number(detail.id),
                                nomorUrut: (parseInt((_h = detail.idProdukFK) === null || _h === void 0 ? void 0 : _h.idKategoriFK.startingNumber) + (i + 1)).toString().padStart(6, "0"),
                                status: client_1.Status["ACTIVE"],
                                tahun: year,
                            });
                        }
                    }
                    //console.log(data)
                    const addNomorRB = yield tx.nomormbr.createMany({
                        data: data
                    });
                }
                return result;
            }), {
                timeout: 60000
            });
            return { data: resultAcceptPermintaan };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Update Permintaan RB
function reject_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const checkPermintaan = yield prisma.permintaan.findFirst({
                where: {
                    id: parseInt(data.id)
                },
                select: {
                    status: true
                }
            });
            if ((checkPermintaan === null || checkPermintaan === void 0 ? void 0 : checkPermintaan.status) != "PENDING") {
                throw new Error("Transaksi sudah dikonfirmasi");
            }
            const updatePermintaan = yield prisma.permintaan.update({
                where: {
                    id: parseInt(data.id)
                },
                data: {
                    idConfirmed: parseInt(data.idConfirmed),
                    timeConfirmed: data.timeConfirmed,
                    status: client_1.Konfirmasi["DITOLAK"],
                    reason: data.reason
                },
                select: {
                    id: true,
                    timeConfirmed: true,
                    status: true,
                    idPermintaanUsersCreatedFK: {
                        select: {
                            email: true
                        }
                    },
                    idPermintaanUsersConfirmedFK: {
                        select: {
                            email: true,
                            nama: true,
                        }
                    }
                }
            });
            const result = {
                id: Number(updatePermintaan.id),
                timeConfirmed: (_a = updatePermintaan.timeConfirmed) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                status: updatePermintaan.status,
                emailCreated: (_b = updatePermintaan.idPermintaanUsersCreatedFK) === null || _b === void 0 ? void 0 : _b.email,
                emailConfirmed: (_c = updatePermintaan.idPermintaanUsersConfirmedFK) === null || _c === void 0 ? void 0 : _c.email,
                nameConfirmed: (_d = updatePermintaan.idPermintaanUsersConfirmedFK) === null || _d === void 0 ? void 0 : _d.nama
            };
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    });
}
// keyword: req.query.keyword == undefined ? null : String(req.query.keyword),
// idBagian: req.query.idBagian == undefined ? null : Number(req.query.idBagian),
// idProduk: req.query.idProduk == undefined ? null : Number(req.query.idProduk),
// status: req.query.status == undefined ? null : checkStatus(String(req.query.status)),
// used: req.query.used == undefined ? null : checkUsed(String(req.query.used)),
// limit: req.query.limit == undefined ? null : Number(req.query.limit),
// offset: req.query.offset == undefined ? null : Number(req.query.offset),
//ANCHOR - Mengambil semua permintaan sesuai status
function get_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const year = new Date().getFullYear();
            const query = `SELECT 
            r."id",
            r."idCreated",
            r."timeCreated",
            r."idBagianCreated",
            b."namaBagian" AS "namaBagianCreated",
            r."idConfirmed",
            ucr."nama" AS "namaCreated",
            uc."nama" AS "namaConfirmed",
            r."timeConfirmed",
            ucr."nik" AS "nikCreated",
            r."reason",
            r."used",
            r."status"
        FROM 
            "permintaan" r
            JOIN "bagian" b ON r."idBagianCreated" = b."id"
            JOIN "users" ucr ON r."idCreated" = ucr."id" 
            LEFT JOIN "users" uc ON r."idConfirmed" = uc."id"
            JOIN "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
            JOIN "produk" p ON d."idProduk" = p."id"
        WHERE 
            1=1
            ${data.idBagian ? ` AND r."idBagianCreated" = ${data.idBagian}` : ''}
            ${(data.keyword !== null) ? `AND (
                ucr."nama" ILIKE '%${data.keyword}%' OR
                ucr."nik" ILIKE '%${data.keyword}%'
            )` : ""}            
            ${(data.idProduk !== null) ? `AND p."id" = ${data.idProduk}` : ""}
            ${(data.status !== null) ? `AND r."status" = '${data.status}'` : ""}
            ${(data.used !== null) ? `AND r."used" = ${data.used}` : ""}
            AND EXTRACT(YEAR FROM r."timeCreated") = ${(_a = data.year) !== null && _a !== void 0 ? _a : year}
        GROUP BY 
            ucr."nama", uc."nama", ucr."nik", r."id", r."idCreated", r."timeCreated", r."idBagianCreated", b."namaBagian", 
            r."idConfirmed", r."timeConfirmed", r."status", r."reason", r."used"
        ORDER BY 
            r."timeCreated" DESC 
        ${data.limit ? `LIMIT ${data.limit}` : ''} 
        ${data.offset ? `OFFSET ${data.offset}` : ''}`;
            // const searchRequest = await prisma.permintaan.findMany({
            //     where: {
            //         status: data.status == null ? undefined : Konfirmasi[data.status as keyof typeof Konfirmasi]
            //     },
            //     select: {
            //         id: true,
            //         idPermintaanUsersCreatedFK: {
            //             select: {
            //                 nama: true,
            //                 nik: true,
            //                 jabatanBagian: {
            //                     select: {
            //                         idBagianJabatanFK: {
            //                             select: {
            //                                 idBagian: true,
            //                                 idBagianFK: {
            //                                     select: {
            //                                         namaBagian: true
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         },
            //         timeCreated: true,
            //         idPermintaanUsersConfirmedFK: {
            //             select: {
            //                 nama: true
            //             }
            //         },
            //         timeConfirmed: true,
            //         status: true,
            //         reason: true
            //     }
            // })
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const result = Array();
            getRequest.forEach((request) => {
                var _a;
                result.push({
                    id: Number(request.id),
                    createdBy: request.namaCreated,
                    createdByBagian: request.namaBagianCreated,
                    createdAt: request.timeCreated.toLocaleString("id-ID"),
                    confirmedBy: request.namaConfirmed || null,
                    confirmedAt: ((_a = request.timeConfirmed) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID")) || null,
                    status: request.status,
                    createdNIK: request.nikCreated,
                    reason: request.reason
                });
            });
            // const result: ModifiedPermintaan[] = getRequest.map((request) => ({
            //     id: String(request.id!),
            //     createdBy: request.namaCreated,
            //     createdNIK: request.nikCreated,
            //     createdByBagian: request.namaBagianCreated,
            //     createdAt: request.timeCreated!.toLocaleString("id-ID"),
            //     confirmedBy: request.namaConfirmed || null,
            //     confirmedAt: request.timeConfirmed?.toLocaleString("id-ID") || null,
            //     status: request.status,
            //     reason: request.reason
            // }))
            // const count = await prisma.permintaan.count({
            //     where: {
            //         status: data.status == null ? undefined : Konfirmasi[data.status as keyof typeof Konfirmasi]
            //     }
            // })
            const queryCount = `SELECT 
            COUNT(*) AS "count"
        FROM (
            SELECT
                r."id" AS id
            FROM
                "permintaan" r
            JOIN "users" ucr ON r."idCreated" = ucr."id" 
            JOIN "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
            JOIN "produk" p ON d."idProduk" = p."id"
            WHERE 
                1=1
                ${data.idBagian ? ` AND r."idBagianCreated" = ${data.idBagian}` : ''}
                ${(data.keyword !== null) ? `AND (
                    ucr."nama" ILIKE '%${data.keyword}%' OR
                    ucr."nik" ILIKE '%${data.keyword}%'
                )` : ""}            
                ${(data.idProduk !== null) ? `AND p."id" = ${data.idProduk}` : ""}
                ${(data.status !== null) ? `AND r."status" = '${data.status}'` : ""}
                ${(data.used !== null) ? `AND r."used" = ${data.used}` : ""}
                AND EXTRACT(YEAR FROM r."timeCreated") = ${(_b = data.year) !== null && _b !== void 0 ? _b : year}
            GROUP BY
                r."id"
        ) AS subquery;`;
            const count = yield prisma.$queryRaw(client_1.Prisma.sql([queryCount]));
            return { data: result, count: Number(count[0].count) };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua rekap permintaan sesuai tahun
function get_recap_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `n."tahun" = ${data.tahun}`;
            if (data.idBagian !== undefined) {
                query += ` AND b."id" = ${data.idBagian}`;
            }
            const recap = yield prisma.$queryRaw `SELECT
            b."id",
            b."namaBagian",
            COUNT(CASE WHEN n."tanggalKembali" IS NULL THEN 1 END) AS "RBBelumKembali",
            COUNT(CASE WHEN n."tanggalKembali" IS NOT NULL THEN 1 END) AS "RBSudahKembali",
            n."tahun"
        FROM
            "nomormbr" n
            JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN "produk" p ON d."idProduk" = p."id"
            JOIN "permintaan" r ON r."id" = d."idPermintaanMbr"
            JOIN "bagian" b ON b."id" = p."idBagian"
        WHERE
            ${client_1.Prisma.sql `(${client_1.Prisma.raw(query)})`}
        GROUP BY
            b."id",
            b."namaBagian",
            n."tahun"`;
            const result = recap.map((request) => ({
                id: Number(request.id),
                namaBagian: request.namaBagian,
                RBBelumKembali: Number(request.RBBelumKembali),
                RBSudahKembali: Number(request.RBSudahKembali),
                tahun: Number(request.tahun)
            }));
            const count = result.length;
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua permintaan sesuai produksi
function get_permintaan_bagian(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRequest = yield prisma.$queryRaw `SELECT
            p."id",
            p."namaProduk",
            COUNT(CASE WHEN n."tanggalKembali" IS NULL THEN 1 END) AS "RBBelumKembali",
            COUNT(CASE WHEN n."tanggalKembali" IS NOT NULL THEN 1 END) AS "RBSudahKembali",
            n."tahun"
        FROM
            "nomormbr" n
            JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN "produk" p ON d."idProduk" = p."id"
        WHERE
            p."idBagian" = ${data.idBagian} AND n."tahun" = ${data.tahun}
        GROUP BY
            p."id", 
            p."namaProduk", 
            n."tahun"`;
            const result = searchRequest.map((request) => ({
                id: Number(request.id),
                namaProduk: request.namaProduk,
                RBBelumKembali: Number(request.RBBelumKembali),
                RBSudahKembali: Number(request.RBSudahKembali),
                tahun: request.tahun
            }));
            const count = result.length;
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua permintaan sesuai produk
function get_permintaan_produk(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `d.idProduk = ${data.idProduk} AND n.tahun = ${data.tahun}`;
            if (data.month !== undefined) {
                query += ` AND MONTH(r.timeCreated) = ${data.month}`;
            }
            const searchRequest = yield prisma.$queryRaw `
                SELECT
            MIN(r."id") AS "idPermintaan",
            p."namaProduk",
            r."timeCreated",
            u."nama",
            u."nik",
            MIN(n."nomorUrut") AS "nomorAwal",
            MAX(n."nomorUrut") AS "nomorAkhir",
            COUNT(CASE WHEN n."tanggalKembali" IS NULL THEN 1 END) AS "RBBelumKembali",
            COUNT(CASE WHEN n."tanggalKembali" IS NOT NULL THEN 1 END) AS "RBSudahKembali",
            n."tahun"
        FROM
            "nomormbr" n
            JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN "produk" p ON d."idProduk" = p."id"
            JOIN "permintaan" r ON r."id" = d."idPermintaanMbr"
            JOIN "users" u ON u."id" = r."idCreated"
        WHERE
            ${client_1.Prisma.raw(query)}
        GROUP BY
            u."nama",
            u."nik",
            r."timeCreated",
            p."namaProduk",
            n."tahun"
        ORDER BY
            r."timeCreated" ASC`;
            const result = searchRequest.map((request) => ({
                idPermintaan: Number(request.idPermintaan),
                nik: request.nik,
                nama: request.nama,
                timeCreated: request.timeCreated.toLocaleString("id-ID"),
                nomorMBR: request.nomorMBR,
                namaProduk: request.namaProduk,
                nomorAwal: request.nomorAwal,
                nomorAkhir: request.nomorAkhir,
                RBBelumKembali: Number(request.RBBelumKembali),
                RBSudahKembali: Number(request.RBSudahKembali),
                tahun: request.tahun
            }));
            const count = result.length;
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua nomor sesuai idPermintaan
function get_nomor_by_id(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRequest = yield prisma.$queryRaw `
                SELECT
            n."id",
            d."nomorMBR",
            p."namaProduk",
            n."nomorUrut",
            n."status",
            n."nomorBatch",
            n."tanggalKembali",
            u."nama"
        FROM
            "nomormbr" n
            JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN "produk" p ON d."idProduk" = p."id"
            JOIN "permintaan" r ON r."id" = d."idPermintaanMbr"
            LEFT JOIN "users" u ON u."id" = n."idUserTerima"
        WHERE
            r."id" = ${data.idPermintaan} AND d."idProduk" = ${data.idProduk}
        ORDER BY
            n."nomorUrut" ASC`;
            const result = searchRequest.map((request) => {
                var _a;
                return ({
                    id: Number(request.id),
                    nomorMBR: request.nomorMBR,
                    namaProduk: request.namaProduk,
                    nomorUrut: request.nomorUrut,
                    status: request.status,
                    nomorBatch: request.nomorBatch,
                    tanggalKembali: (_a = request.tanggalKembali) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID"),
                    nama: request.nama,
                });
            });
            const count = result.length;
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua permintaan berdasarkan idPermintaan
function get_permintaan_by_id(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRequest = yield prisma.detailpermintaanmbr.findMany({
                where: {
                    idPermintaanMbr: data.idPermintaan
                },
                select: {
                    id: true,
                    nomorMBR: true,
                    group_id: true,
                    jumlah: true,
                    tipeMBR: true,
                    idProduk: true,
                    idProdukFK: {
                        select: {
                            namaProduk: true
                        }
                    }
                }
            });
            const result = searchRequest.reduce((acc, produk) => {
                const checkExist = acc.find(item => item.idProduk === produk.idProduk && item.items[0].group_id === produk.group_id);
                if (checkExist) {
                    checkExist.items.push({
                        group_id: produk.group_id,
                        id: Number(produk.id),
                        nomorMBR: produk.nomorMBR,
                        jumlah: produk.jumlah,
                        tipeMBR: produk.tipeMBR
                    });
                }
                else {
                    acc.push({
                        idProduk: produk.idProduk,
                        namaProduk: produk.idProdukFK.namaProduk,
                        items: [{
                                group_id: produk.group_id,
                                id: Number(produk.id),
                                nomorMBR: produk.nomorMBR,
                                jumlah: produk.jumlah,
                                tipeMBR: produk.tipeMBR
                            }]
                    });
                }
                return acc;
            }, []);
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - List Nomor Awal Akhir by Permintaan
function get_nomor_permintaan_by_id(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRequest = yield prisma.$queryRaw `
                SELECT
            d."id",
            d."idProduk",
            d."nomorMBR",
            p."namaProduk",
            d."tipeMBR",
            d."jumlah",
            MIN(n."nomorUrut") AS "nomorAwal",
            MAX(n."nomorUrut") AS "nomorAkhir",
            d."group_id"
        FROM
            "nomormbr" n
            JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN "produk" p ON d."idProduk" = p."id"
            JOIN "permintaan" r ON r."id" = d."idPermintaanMbr"
        WHERE
            r."id" = ${data.idPermintaan}			
        GROUP BY
            d."id", d."idProduk", d."nomorMBR", d."tipeMBR", d."jumlah", d."group_id", p."namaProduk";`;
            const result = searchRequest.reduce((acc, produk) => {
                const checkExist = acc.find(item => Number(item.idProduk) === Number(produk.idProduk) && Number(item.items[0].group_id) === Number(produk.group_id));
                if (checkExist) {
                    checkExist.items.push({
                        group_id: Number(produk.group_id),
                        id: Number(produk.idProduk),
                        nomorMBR: produk.nomorMBR,
                        jumlah: Number(produk.jumlah),
                        tipeMBR: produk.tipeMBR,
                        nomorAwal: produk.nomorAwal,
                        nomorAkhir: produk.nomorAkhir
                    });
                }
                else {
                    acc.push({
                        idProduk: Number(produk.idProduk),
                        namaProduk: produk.namaProduk,
                        items: [{
                                group_id: Number(produk.group_id),
                                id: Number(produk.idProduk),
                                nomorMBR: produk.nomorMBR,
                                jumlah: Number(produk.jumlah),
                                tipeMBR: produk.tipeMBR,
                                nomorAwal: produk.nomorAwal,
                                nomorAkhir: produk.nomorAkhir
                            }]
                    });
                }
                return acc;
            }, []);
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
function get_rb_return_by_product(id, status, numberFind, limit, offset, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `SELECT
            d."idPermintaanMbr" AS "id",
            d."idProduk",
            p."namaProduk",
            EXTRACT(DAY FROM r."timeCreated") AS "tanggal",
            EXTRACT(MONTH FROM r."timeCreated") AS "bulan",
            EXTRACT(YEAR FROM r."timeCreated") AS "tahun",
            MIN(n."nomorUrut") AS "nomorAwal",
            MAX(n."nomorUrut") AS "nomorAkhir",
            COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) AS "RBBelumKembali"
            ${status == "outstanding" ? `,
            COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) AS "JumlahOutstanding"` : ""}
        FROM
            "nomormbr" n
        JOIN 
            "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
        JOIN
            "produk" p ON p."id" = d."idProduk"
        JOIN
            "permintaan" r ON r."id" = d."idPermintaanMbr"
        WHERE
            d."idProduk" = ${id}
            ${(startDate !== null && endDate !== null) ? `AND (
                (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND 
                EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                AND 
                (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND 
                EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
            ) ` : ""}
        GROUP BY
            p."namaProduk", r."timeCreated", d."idProduk", d."idPermintaanMbr"          
        HAVING
            1=1 
            ${(numberFind !== null) ? `AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}%' THEN 1 ELSE 0 END) > 0` : ""}
            ${(status === "belum") ? "AND COUNT(CASE WHEN n.\"status\" = 'ACTIVE' THEN 1 END) > 0" : ""}
            ${(status === "outstanding") ? "AND COUNT(CASE WHEN (n.\"status\" = 'KEMBALI' OR n.\"status\" = 'BATAL') AND n.\"idUserTerima\" IS NULL THEN 1 END) > 0" : ""}
        ${limit != null && offset != null ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const countQuery = `SELECT COUNT(*) AS "count" FROM (
            SELECT
                d."idPermintaanMbr"
            FROM
                "nomormbr" n
            JOIN 
                "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN
                "permintaan" r ON r."id" = d."idPermintaanMbr"
            WHERE
                d."idProduk" = ${id}
                ${(startDate !== null && endDate !== null) ? `AND (
                    (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                    (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND 
                    EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                    AND 
                    (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                    (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND 
                    EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
                ) ` : ""}
            GROUP BY
                d."idPermintaanMbr"
            HAVING 
                1=1
                ${(numberFind !== null) ? `AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}%' THEN 1 ELSE 0 END) > 0` : ""}
                ${status === "belum" ? `AND COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0 ` : ""}
                ${status === "outstanding" ? `AND COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0` : ""}
        ) AS subquery;`;
            const getCount = yield prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                let data = {
                    id: String(item.id),
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan}`,
                    tahun: String(item.tahun),
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali),
                };
                if (status === "outstanding") {
                    data = Object.assign(Object.assign({}, data), { JumlahOutstanding: String(item.JumlahOutstanding) });
                }
                result.push(data);
            });
            //console.log(getCount[0].count.toString())
            return { data: result, count: getCount[0].count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Bagian
function get_rb_return_by_bagian(id, status, numberFind, limit, offset, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log(status)
        try {
            let query = `SELECT
            d."idPermintaanMbr" AS id,
            d."idProduk",
            p."namaProduk",
            EXTRACT(DAY FROM r."timeCreated") AS tanggal,
            EXTRACT(MONTH FROM r."timeCreated") AS bulan,
            EXTRACT(YEAR FROM r."timeCreated") AS tahun,
            MIN(n."nomorUrut") AS nomorAwal,
            MAX(n."nomorUrut") AS nomorAkhir,
            COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) AS "RBBelumKembali"
            ${status === "outstanding" ? `, COUNT( CASE WHEN ( n."status" = 'KEMBALI' OR n."status" = 'BATAL' ) AND n."idUserTerima" IS NULL THEN 1 END ) AS "JumlahOutstanding"` : ""}
        FROM
            "nomormbr" n
        JOIN 
            "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
        JOIN
            "produk" p ON p."id" = d."idProduk"
        JOIN
            "permintaan" r ON r."id" = d."idPermintaanMbr"
        WHERE
            r."idBagianCreated" = ${id}
            ${(startDate !== null && endDate !== null) ? `AND (
                (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND 
                EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                AND 
                (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND 
                EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
            ) ` : ""}
        GROUP BY
            p."namaProduk", r."timeCreated", d."idProduk", d."idPermintaanMbr"          
        HAVING
            1=1 
            ${(numberFind !== null) ? ` AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}%' THEN 1 ELSE 0 END) > 0` : ""}
            ${(status === "belum") ? ` AND "RBBelumKembali" > 0` : ""}
            ${(status === "outstanding") ? ` AND COUNT( CASE WHEN ( n."status" = 'KEMBALI' OR n."status" = 'BATAL' ) AND n."idUserTerima" IS NULL THEN 1 END ) > 0` : ""}
        ${limit != null && offset != null ? ` LIMIT ${limit} OFFSET ${offset}` : ''}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const countQuery = `SELECT COUNT(*) AS "count" FROM (
            SELECT
                d."idPermintaanMbr"
            FROM
                "nomormbr" n
            JOIN 
                "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
            JOIN
                "permintaan" r ON r."id" = d."idPermintaanMbr"
            WHERE
                r."idBagianCreated" = ${id}
                ${(startDate !== null && endDate !== null) ? `AND (
                    (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                    (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND 
                    EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                    AND 
                    (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                    (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND 
                    EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
                ) ` : ""}
            GROUP BY
                d."idPermintaanMbr"
            HAVING 
                1=1
                ${(numberFind !== null) ? `AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}%' THEN 1 ELSE 0 END) > 0` : ""}
                ${status === "belum" ? `AND COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0 ` : ""}
                ${status === "outstanding" ? `AND COUNT(CASE WHEN ( n."status" = 'KEMBALI' OR n."status" = 'BATAL' ) AND n."idUserTerima" IS NULL THEN 1 END) > 0` : ""}
        ) AS subquery;`;
            const getCount = yield prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                let data = {
                    id: String(item.id),
                    idProduk: String(item.idProduk),
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan} `,
                    tahun: String(item.tahun),
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali),
                };
                if (status === "outstanding") {
                    data = Object.assign(Object.assign({}, data), { JumlahOutstanding: String(item.JumlahOutstanding) });
                }
                result.push(data);
            });
            //console.log(getCount[0].count.toString())
            return { data: result, count: getCount[0].count };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
function get_rb_return_by_status_outstanding(numberFind, limit, offset, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `SELECT
            d."idPermintaanMbr" AS "id",
            d."idProduk",
            p."namaProduk",
            EXTRACT(DAY FROM r."timeCreated") AS "tanggal",
            EXTRACT(MONTH FROM r."timeCreated") AS "bulan",
            EXTRACT(YEAR FROM r."timeCreated") AS "tahun",
            MIN(n."nomorUrut") AS "nomorAwal",
            MAX(n."nomorUrut") AS "nomorAkhir",
            COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) AS "RBBelumKembali",
            COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) AS "JumlahOutstanding"
        FROM
            "nomormbr" n
        JOIN 
            "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
        JOIN
            "produk" p ON p."id" = d."idProduk"
        JOIN
            "permintaan" r ON r."id" = d."idPermintaanMbr"
        WHERE
            1=1
            ${(startDate !== null && endDate !== null) ? ` AND (
                (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                AND
                (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
            ) ` : ""}
        GROUP BY
            p."namaProduk", 
            r."timeCreated", 
            d."idProduk", 
            d."idPermintaanMbr"
        HAVING
            COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0
            ${(numberFind !== null) ? `AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
        ORDER BY r."timeCreated" DESC
        ${(limit != null && offset != null) ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const countQuery = `SELECT COUNT(*) as "count"
            FROM (
                SELECT
                    d."idPermintaanMbr"
                FROM
                    "nomormbr" n
                JOIN 
                    "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
                JOIN
                    "permintaan" r ON r."id" = d."idPermintaanMbr"
                WHERE
                    1=1
                    ${(startDate !== null && endDate !== null) ? ` AND (
                        (EXTRACT(YEAR FROM r."timeCreated") > ${startDate.split("-")[1]} OR 
                        (EXTRACT(YEAR FROM r."timeCreated") = ${startDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]}))
                        AND
                        (EXTRACT(YEAR FROM r."timeCreated") < ${endDate.split("-")[1]} OR 
                        (EXTRACT(YEAR FROM r."timeCreated") = ${endDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}))
                    ) ` : ""}
                GROUP BY
                    d."idPermintaanMbr"
                HAVING 
                    COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0
                    ${(numberFind !== null) ? `AND SUM(CASE WHEN CAST(n."nomorUrut" AS TEXT) LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
            ) as subquery;`;
            const getCount = yield prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                let data = {
                    id: String(item.id),
                    idProduk: String(item.idProduk),
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan} `,
                    tahun: String(item.tahun),
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali),
                    JumlahOutstanding: String(item.JumlahOutstanding)
                };
                result.push(data);
            });
            //console.log(getCount[0].count.toString())
            return { data: result, count: getCount[0].count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk dan Permintaan
function get_rb_return_by_product_and_permintaan(id, idPermintaan, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT
            d."id",
            d."nomorMBR",
            d."tipeMBR",
            p."namaProduk",
            EXTRACT(DAY FROM r."timeCreated") AS "tanggal",
            EXTRACT(MONTH FROM r."timeCreated") AS "bulan",
            EXTRACT(YEAR FROM r."timeCreated") AS "tahun",
            MIN(n."nomorUrut") AS "nomorAwal",
            MAX(n."nomorUrut") AS "nomorAkhir",
            COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) AS "RBBelumKembali"
            ${(status == "outstanding" || status == "all") ? `, COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) AS "JumlahOutstanding"` : ``}
        FROM
            "nomormbr" n
        JOIN 
            "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
        JOIN
            "produk" p ON p."id" = d."idProduk"
        JOIN
            "permintaan" r ON r."id" = d."idPermintaanMbr"
        WHERE
            d."idProduk" = ${id} 
            AND d."idPermintaanMbr" = ${idPermintaan}
        GROUP BY
            p."namaProduk", r."timeCreated", d."id", d."nomorMBR", d."tipeMBR"
        HAVING
            1=1 
            ${(status === "belum") ? `AND COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0` : ``}
            ${(status === "outstanding") ? `AND COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0` : ``}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                let data = {
                    id: String(item.id),
                    tipeMBR: item.tipeMBR,
                    nomorMBR: item.nomorMBR,
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan} `,
                    tahun: String(item.tahun),
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali)
                };
                if (status === "outstanding" || status === "all") {
                    data = Object.assign(Object.assign({}, data), { JumlahOutstanding: String(item.JumlahOutstanding) });
                }
                result.push(data);
            });
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Get Permintaan RB Return Berdasarkan ID Permintaan
function get_rb_return_by_id_permintaan(idPermintaan, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getRequest = yield prisma.nomormbr.findMany({
                where: {
                    idDetailPermintaan: idPermintaan
                },
                select: {
                    id: true,
                    nomorUrut: true,
                    status: true,
                    tanggalKembali: true,
                    idUserTerimaFK: {
                        select: {
                            nama: true
                        }
                    },
                    nomorBatch: true,
                },
                skip: offset !== null && offset !== void 0 ? offset : undefined,
                take: limit !== null && limit !== void 0 ? limit : undefined
            });
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                var _a, _b;
                result.push({
                    id: Number(item.id),
                    nomorUrut: item.nomorUrut,
                    status: item.status,
                    tanggalKembali: (_a = item.tanggalKembali) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    namaUserTerima: (_b = item.idUserTerimaFK) === null || _b === void 0 ? void 0 : _b.nama,
                    nomorBatch: item.nomorBatch,
                });
            });
            const getCount = yield prisma.nomormbr.count({
                where: {
                    idDetailPermintaan: idPermintaan
                }
            });
            return { data: result, count: getCount };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Update Nomor RB Return
function set_nomor_rb_return(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateRequest = yield prisma.nomormbr.update({
                where: {
                    id: id
                },
                data: {
                    nomorBatch: data.nomor_batch,
                    status: data.status,
                    tanggalKembali: data.tanggal_kembali
                }
            });
            if (updateRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            return { data: true };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Confirm Nomor RB Return
function confirm_rb_return(id, idAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateRequest = yield prisma.nomormbr.update({
                where: {
                    id: id
                },
                data: {
                    idUserTerima: idAdmin
                }
            });
            if (updateRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            return { data: true };
        }
        catch (error) {
            throw error;
        }
    });
}
// ANCHOR - Laporan RB Belum Kembali perbagian
function get_laporan_rb_belum_kembali_perbagian(idBagian, status, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const year = new Date().getFullYear();
            const query = `SELECT
            n."nomorUrut",
            p."namaProduk",
            r."timeConfirmed",
            d."tipeMBR",
            b."namaBagian",
            n."status",
            n."nomorBatch",
            n."tanggalKembali"
        FROM
            "nomormbr" n
        JOIN "detailpermintaanmbr" d ON d."id" = n."idDetailPermintaan"
        JOIN "produk" p ON d."idProduk" = p."id"
        JOIN "permintaan" r ON r."id" = d."idPermintaanMbr"
        JOIN "kategori" k ON k."id" = p."idKategori"
        JOIN "bagian" b ON b."id" = p."idBagian"
        WHERE
            r."idBagianCreated" = ${idBagian}
            ${(status !== null) ? `AND n."status" = '${status}' AND n."tanggalKembali" IS NULL` : ""}
            ${(startDate !== null && endDate !== null) ? ` AND (
                ( EXTRACT(YEAR FROM r."timeCreated") >= ${startDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]} )
                AND ( EXTRACT(YEAR FROM r."timeCreated") <= ${endDate.split("-")[1]} AND EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]} )
            )` : `AND EXTRACT(YEAR FROM r."timeCreated") = ${year}`}
        ORDER BY 
            b."namaBagian", k."namaKategori", p."namaProduk", n."nomorUrut", r."timeCreated" ASC;`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            if (getRequest.length == 0) {
                return { data: null };
            }
            return { data: getRequest };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Generate Report Dashboard Admin
function generate_report_dashboard_admin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            const formattedDate = twoMonthsAgo.toLocaleDateString("id-ID", {
                month: '2-digit', // mm
                year: 'numeric' // yyyy
            });
            const bulanTahun = formattedDate.split("/");
            const dateNow = new Date();
            const yearNow = dateNow.getFullYear();
            //console.log(bulanTahun)
            const query = `SELECT
                COUNT(CASE 
                        WHEN n.status = 'ACTIVE'
                        AND ((EXTRACT(MONTH FROM r."timeCreated") <= ${bulanTahun[0]} AND EXTRACT(YEAR FROM r."timeCreated") <= ${bulanTahun[1]}) OR r."timeCreated" IS NULL)
                        THEN 1 
                        ELSE NULL 
                    END) AS count,
                    b."namaBagian"
                FROM
                    bagian b
                    LEFT JOIN permintaan r ON b."id" = r."idBagianCreated"
                    LEFT JOIN detailpermintaanmbr d ON r."id" = d."idPermintaanMbr"
                    LEFT JOIN nomormbr n ON d."id" = n."idDetailPermintaan"
                WHERE
                    b."idJenisBagian" IN (1, 2)
                GROUP BY
                b."namaBagian";`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const result = getRequest.map(item => ({
                count: String(item.count),
                namaBagian: item.namaBagian
            }));
            const queryRBDibuat = `SELECT
                COUNT(
                    CASE
                        WHEN n."id" IS NOT NULL 
                        AND (EXTRACT(YEAR FROM r."timeCreated") = ${yearNow} OR r."timeCreated" IS NULL) 
                        THEN 1 
                        ELSE NULL 
                    END 
                ) AS "count",
                j."namaJenisBagian" 
            FROM
                "permintaan" r
                LEFT JOIN "bagian" b ON r."idBagianCreated" = b."id"
                JOIN "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
                JOIN "nomormbr" n ON d."id" = n."idDetailPermintaan"
                RIGHT JOIN "jenis_bagian" j ON b."idJenisBagian" = j."id"
            WHERE
                j."id" IN (1, 2)
            GROUP BY
                j."namaJenisBagian";`;
            const getRequestRBDibuat = yield prisma.$queryRaw(client_1.Prisma.sql([queryRBDibuat]));
            const resultRBDibuat = new Array();
            getRequestRBDibuat.map(item => {
                resultRBDibuat.push({
                    count: String(item.count),
                    namaJenisBagian: item.namaJenisBagian
                });
            });
            return {
                data: {
                    RBBelumKembali: result,
                    RBDibuat: resultRBDibuat
                }
            };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Generate Report Dashboard Admin
function generate_report_pembuatan_rb(tahun) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT
            j."namaJenisBagian",
            COUNT( CASE WHEN n."id" IS NOT NULL THEN 1 ELSE NULL END ) AS total,
            COUNT( CASE WHEN n."id" IS NOT NULL AND EXTRACT(DAY FROM r."timeConfirmed" - r."timeCreated") > 2 THEN 1 ELSE NULL END ) AS late,
            EXTRACT(MONTH FROM r."timeCreated") AS bulan,
            EXTRACT(YEAR FROM r."timeCreated") AS tahun
        FROM
            "permintaan" r
        LEFT JOIN "bagian" b ON r."idBagianCreated" = b."id"
        JOIN "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
        JOIN "nomormbr" n ON d."id" = n."idDetailPermintaan"
        RIGHT JOIN "jenis_bagian" j ON b."idJenisBagian" = j."id"
        WHERE
            j."id" IN (1, 2)
            AND EXTRACT(YEAR FROM r."timeCreated") = ${tahun}
        GROUP BY
            j."namaJenisBagian",
            EXTRACT(MONTH FROM r."timeCreated"),
            EXTRACT(YEAR FROM r."timeCreated");`;
            const request = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            if (request.length == 0) {
                return { data: [] };
            }
            const groupedData = request.reduce((acc, curr) => {
                // Cari apakah sudah ada elemen dengan namaJenisBagian yang sama
                const existingGroup = acc.find(item => item.namaJenisBagian === curr.namaJenisBagian);
                if (existingGroup) {
                    // Jika ada, tambahkan data ke array `data`
                    existingGroup.data.push({
                        total: Number(curr.total),
                        late: Number(curr.late),
                        month: Number(curr.bulan)
                    });
                }
                else {
                    // Jika belum ada, buat grup baru
                    acc.push({
                        namaJenisBagian: curr.namaJenisBagian,
                        data: [{
                                total: Number(curr.total),
                                late: Number(curr.late),
                                month: Number(curr.bulan)
                            }]
                    });
                }
                return acc;
            }, []);
            return { data: groupedData };
        }
        catch (error) {
            throw error;
        }
    });
}
