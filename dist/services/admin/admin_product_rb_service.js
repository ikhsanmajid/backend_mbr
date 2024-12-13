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
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
exports.confirm_rb_return = confirm_rb_return;
exports.get_laporan_rb_belum_kembali_perbagian = get_laporan_rb_belum_kembali_perbagian;
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
//ANCHOR - Update Permintaan RB
function accept_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultAcceptPermintaan = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
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
                        status: true
                    }
                });
                const result = {
                    id: acceptPermintaan.id,
                    timeConfirmed: (_a = acceptPermintaan.timeConfirmed) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    status: acceptPermintaan.status
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
                                            idKategori: (_b = detail.idProdukFK) === null || _b === void 0 ? void 0 : _b.idKategori
                                        }
                                    }
                                }, {
                                    tahun: year
                                }]
                        },
                        _max: {
                            nomorUrut: true
                        }
                    });
                    if (findNomor._max.nomorUrut != null) {
                        for (let i = 0; i < detail.jumlah; i++) {
                            data.push({
                                idDetailPermintaan: detail.id,
                                nomorUrut: (parseInt(findNomor._max.nomorUrut) + (i + 1)).toString().padStart(6, "0"),
                                status: client_1.Status["ACTIVE"],
                                tahun: year,
                            });
                        }
                    }
                    else {
                        for (let i = 0; i < detail.jumlah; i++) {
                            data.push({
                                idDetailPermintaan: detail.id,
                                nomorUrut: (parseInt((_c = detail.idProdukFK) === null || _c === void 0 ? void 0 : _c.idKategoriFK.startingNumber) + (i + 1)).toString().padStart(6, "0"),
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
            }));
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
        var _a;
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
                    status: true
                }
            });
            const result = {
                id: updatePermintaan.id,
                timeConfirmed: (_a = updatePermintaan.timeConfirmed) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                status: updatePermintaan.status
            };
            return { data: result };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Mengambil semua permintaan sesuai status
function get_permintaan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchRequest = yield prisma.permintaan.findMany({
                where: {
                    status: data.status == null ? undefined : client_1.Konfirmasi[data.status]
                },
                select: {
                    id: true,
                    idPermintaanUsersCreatedFK: {
                        select: {
                            nama: true,
                            nik: true,
                            jabatanBagian: {
                                select: {
                                    idBagianJabatanFK: {
                                        select: {
                                            idBagian: true,
                                            idBagianFK: {
                                                select: {
                                                    namaBagian: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    timeCreated: true,
                    idPermintaanUsersConfirmedFK: {
                        select: {
                            nama: true
                        }
                    },
                    timeConfirmed: true,
                    status: true,
                    reason: true
                }
            });
            const result = searchRequest.map((request) => {
                var _a, _b;
                return ({
                    id: request.id,
                    createdBy: request.idPermintaanUsersCreatedFK.nama,
                    createdNIK: request.idPermintaanUsersCreatedFK.nik,
                    createdByBagian: request.idPermintaanUsersCreatedFK.jabatanBagian[0].idBagianJabatanFK.idBagianFK.namaBagian,
                    createdAt: request.timeCreated.toLocaleString("id-ID"),
                    confirmedBy: ((_a = request.idPermintaanUsersConfirmedFK) === null || _a === void 0 ? void 0 : _a.nama) || null,
                    confirmedAt: ((_b = request.timeConfirmed) === null || _b === void 0 ? void 0 : _b.toLocaleString("id-ID")) || null,
                    status: request.status,
                    reason: request.reason
                });
            });
            const count = yield prisma.permintaan.count({
                where: {
                    status: data.status == null ? undefined : client_1.Konfirmasi[data.status]
                }
            });
            return { data: result, count: count };
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
            let query = `n.tahun = ${data.tahun}`;
            if (data.idBagian !== undefined) {
                query += ` AND b.id = ${data.idBagian}`;
            }
            const recap = yield prisma.$queryRaw `SELECT
                b.id,
                b.namaBagian,
                COUNT( CASE WHEN n.tanggalKembali IS NULL THEN 1 END ) AS "RBBelumKembali",
                COUNT( CASE WHEN n.tanggalKembali IS NOT NULL THEN 1 END ) AS "RBSudahKembali",
                n.tahun 
            FROM
                nomormbr n
                JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
                JOIN produk p ON d.idProduk = p.id
                JOIN permintaan r ON r.id = d.idPermintaanMbr
                JOIN bagian b ON b.id = p.idBagian
            WHERE
                ${client_1.Prisma.sql `(${client_1.Prisma.raw(query)})`}
            GROUP BY
                b.namaBagian,
                n.tahun`;
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
                p.id,
                p.namaProduk,
                COUNT( CASE WHEN n.tanggalKembali IS NULL THEN 1 END ) AS "RBBelumKembali",
                COUNT( CASE WHEN n.tanggalKembali IS NOT NULL THEN 1 END ) AS "RBSudahKembali",
                n.tahun
            FROM
                nomormbr n
                JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
                JOIN produk p ON d.idProduk = p.id 
            WHERE
                p.idBagian = ${data.idBagian} AND n.tahun = ${data.tahun}
            GROUP BY
                p.id,
                p.namaProduk,
                n.tahun`;
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
                MIN(r.id) AS idPermintaan,
                p.namaProduk,
                r.timeCreated,
                u.nama,
                u.nik,
                MIN(n.nomorUrut) AS "nomorAwal",
                MAX(n.nomorUrut) AS "nomorAkhir",
                COUNT( CASE WHEN n.tanggalKembali IS NULL THEN 1 END ) AS "RBBelumKembali",
                COUNT( CASE WHEN n.tanggalKembali IS NOT NULL THEN 1 END ) AS "RBSudahKembali",
                n.tahun 
            FROM
                nomormbr n
                JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
                JOIN produk p ON d.idProduk = p.id 
                JOIN permintaan r ON r.id = d.idPermintaanMbr
                JOIN users u ON u.id = r.idCreated
            WHERE
                ${client_1.Prisma.sql `(${client_1.Prisma.raw(query)})`}
            GROUP BY
                u.nama,
                u.nik,
                r.timeCreated,
                p.namaProduk,
                n.tahun
            ORDER BY
                r.timeCreated ASC`;
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
                n.id,
                d.nomorMBR,
                p.namaProduk,
                n.nomorUrut,
                n.status,
                n.nomorBatch,
                n.tanggalKembali,
                u.nama
            FROM
                nomormbr n
                JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
                JOIN produk p ON d.idProduk = p.id
                JOIN permintaan r ON r.id = d.idPermintaanMbr
                LEFT JOIN users u ON u.id = n.idUserTerima 
            WHERE
                r.id = ${data.idPermintaan} AND d.idProduk = ${data.idProduk}
            ORDER BY
                n.nomorUrut ASC`;
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
                        id: produk.id,
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
                                id: produk.id,
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
				d.id,
				d.idProduk,
                d.nomorMBR,
                p.namaProduk,
                d.tipeMBR,
				d.jumlah,
                MIN(n.nomorUrut) AS "nomorAwal",
				MAX(n.nomorUrut) AS "nomorAkhir",
				d.group_id
            FROM
                nomormbr n
                JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
                JOIN produk p ON d.idProduk = p.id
                JOIN permintaan r ON r.id = d.idPermintaanMbr
            WHERE
                r.id = ${data.idPermintaan}			
			GROUP BY
			d.id, d.idProduk, d.nomorMBR, d.tipeMBR, d.jumlah, d.group_id;`;
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
function get_rb_return_by_product(id, status, limit, offset, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `SELECT
            d.idPermintaanMbr AS id,
            d.idProduk,
            p.namaProduk,
            DAY(r.timeCreated) AS tanggal,
            MONTH(r.timeCreated) AS bulan,
            YEAR(r.timeCreated) AS tahun,
            MIN(n.nomorUrut) AS nomorAwal,
            MAX(n.nomorUrut) AS nomorAkhir,
            COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) AS RBBelumKembali
            ${status == "outstanding" ? ", COUNT( CASE WHEN ( n.status = 'KEMBALI' OR n.status = 'BATAL' ) AND n.idUserTerima IS NULL THEN 1 END ) AS JumlahOutstanding" : ""}
        FROM
            nomormbr n
        JOIN 
            detailpermintaanmbr d ON d.id = n.idDetailPermintaan
        JOIN
            produk p ON p.id = d.idProduk
        JOIN
            permintaan r ON r.id = d.idPermintaanMbr
        WHERE
            d.idProduk = ${id}
            ${(startDate !== null && endDate !== null) ? `AND (
		    ( YEAR ( r.timeCreated ) = ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		    AND ( YEAR ( r.timeCreated ) = ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	        )` : ""}
        GROUP BY
            p.namaProduk, r.timeCreated, d.idProduk, d.idPermintaanMbr          
        HAVING
            1=1 
            ${(status === "belum") ? "AND RBBelumKembali > 0" : ""}
            ${(status === "outstanding") ? "AND JumlahOutstanding > 0" : ""}
        ${(limit != null && offset != null) ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            const countQuery = `SELECT COUNT(*) as "count" FROM
            (SELECT
            d.idPermintaanMbr
            FROM
                nomormbr n
            JOIN 
                detailpermintaanmbr d ON d.id = n.idDetailPermintaan
            JOIN
                permintaan r ON r.id = d.idPermintaanMbr
            WHERE
                d.idProduk = ${id}
                ${(startDate !== null && endDate !== null) ? ` AND (
		        ( YEAR ( r.timeCreated ) = ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		        AND ( YEAR ( r.timeCreated ) = ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	            )` : ""}
            GROUP BY
                d.idPermintaanMbr
            HAVING 
            1=1
            ${status == "belum" ? `AND COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
            ${status == "outstanding" ? `AND COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
            ) as subquery`;
            const getCount = yield prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                let data = {
                    id: String(item.id),
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan} `,
                    tahun: item.tahun,
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
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk dan Permintaan
function get_rb_return_by_product_and_permintaan(id, idPermintaan, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `
        SELECT
        d.id,
            d.nomorMBR,
            d.tipeMBR,
            p.namaProduk,
            DAY(r.timeCreated) AS tanggal,
            MONTH(r.timeCreated) AS bulan,
            YEAR(r.timeCreated) AS tahun,
            MIN(n.nomorUrut) AS nomorAwal,
            MAX(n.nomorUrut) AS nomorAkhir,
            COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) AS RBBelumKembali
            ${(status == "outstanding" || status == "all") ? ", COUNT( CASE WHEN ( n.status = 'KEMBALI' OR n.status = 'BATAL' ) AND n.idUserTerima IS NULL THEN 1 END ) AS JumlahOutstanding" : ""}
        FROM
            nomormbr n
        JOIN 
            detailpermintaanmbr d ON d.id = n.idDetailPermintaan
        JOIN
            produk p ON p.id = d.idProduk
        JOIN
            permintaan r ON r.id = d.idPermintaanMbr
        WHERE
        d.idProduk = ${id} AND d.idPermintaanMbr = ${idPermintaan}
        GROUP BY
        p.namaProduk, r.timeCreated, d.id, d.nomorMBR, d.tipeMBR
        HAVING
        1=1 
            ${(status === "belum") ? "AND RBBelumKembali > 0" : ""}
            ${(status === "outstanding") ? "AND JumlahOutstanding > 0" : ""}`;
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
                    tanggalBulan: `${item.tanggal} -${item.bulan} `,
                    tahun: item.tahun,
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
                    id: item.id,
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
            n.nomorUrut,
            p.namaProduk,
            r.timeCreated,
            d.nomormbr,
            d.tipeMBR,
            k.namaKategori,
            b.namaBagian,
            n.status,
	        n.nomorBatch
                    FROM
            nomormbr n
            JOIN detailpermintaanmbr d ON d.id = n.idDetailPermintaan
            JOIN produk p ON d.idProduk = p.id
            JOIN permintaan r ON r.id = d.idPermintaanMbr
            JOIN kategori k ON k.id = p.idKategori
            JOIN bagian b ON b.id = p.idBagian
                    WHERE
            r.idBagianCreated = ${idBagian} 
            ${(status !== null) ? `AND n.status = '${status}' AND n.tanggalKembali IS NULL ` : ""}
            ${(startDate !== null && endDate !== null) ? ` AND (
		        ( YEAR ( r.timeCreated ) = ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		        AND ( YEAR ( r.timeCreated ) = ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	            )` : `AND YEAR(r.timeCreated) = ${year}`}
            ORDER BY b.namaBagian, k.namaKategori, p.namaProduk, r.timeCreated, n.nomorUrut, d.tipeMBR ASC`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            console.log(getRequest);
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