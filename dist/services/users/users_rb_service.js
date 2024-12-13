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
exports.add_request = add_request;
exports.edit_request = edit_request;
exports.set_request_used = set_request_used;
exports.get_request_by_bagian = get_request_by_bagian;
exports.get_request_by_id = get_request_by_id;
exports.get_rb_return_by_product = get_rb_return_by_product;
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
exports.check_id_user_not_null = check_id_user_not_null;
exports.check_product_same_department = check_product_same_department;
const client_1 = require("@prisma/client");
//SECTION - Product Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Tambah Permintaan RB
function add_request(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactionRequest = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const addRequestRB = yield tx.permintaan.create({
                    data: {
                        idCreated: parseInt(data.idCreated.toString()),
                        idBagianCreated: parseInt(data.idBagianCreated.toString()),
                        timeCreated: data.timeCreated,
                    },
                    select: {
                        id: true,
                        idCreated: true,
                        timeCreated: true
                    }
                });
                const result = {
                    id: addRequestRB.id,
                    idCreated: addRequestRB.idCreated,
                    timeCreated: (_a = addRequestRB.timeCreated) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                };
                const listMBR = Array();
                data.data.map((item, index) => {
                    item.mbr.map(mbr => {
                        listMBR.push({
                            idPermintaanMbr: parseInt(result.id.toString()),
                            idProduk: parseInt(item.idProduk),
                            group_id: index,
                            nomorMBR: mbr.no_mbr,
                            tipeMBR: mbr.tipe_mbr == "PO" ? client_1.TipeMBR["PO"] : client_1.TipeMBR["PS"],
                            jumlah: parseInt(mbr.jumlah)
                        });
                    });
                });
                const createDetailPermintaan = yield tx.detailpermintaanmbr.createMany({
                    data: listMBR
                });
                if (createDetailPermintaan.count > 0) {
                    return {
                        requestMBR: result,
                        detailPermintaan: listMBR
                    };
                }
                else {
                    return null;
                }
            }));
            return { data: { requestRB: transactionRequest.requestMBR, detailPermintaan: transactionRequest.detailPermintaan } };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Edit Permintaan RB
function edit_request(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactionRequest = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const deleteOldRequest = yield tx.permintaan.delete({
                    where: {
                        id: data.oldid
                    }
                });
                const addRequestRB = yield tx.permintaan.create({
                    data: {
                        idCreated: parseInt(data.idCreated.toString()),
                        idBagianCreated: parseInt(data.idBagianCreated.toString()),
                        timeCreated: data.timeCreated,
                    },
                    select: {
                        id: true,
                        idCreated: true,
                        timeCreated: true
                    }
                });
                const result = {
                    id: addRequestRB.id,
                    idCreated: addRequestRB.idCreated,
                    timeCreated: (_a = addRequestRB.timeCreated) === null || _a === void 0 ? void 0 : _a.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                };
                const listMBR = Array();
                data.data.map((item, index) => {
                    item.mbr.map(mbr => {
                        listMBR.push({
                            idPermintaanMbr: parseInt(result.id.toString()),
                            idProduk: parseInt(item.idProduk),
                            group_id: index,
                            nomorMBR: mbr.no_mbr,
                            tipeMBR: mbr.tipe_mbr == "PO" ? client_1.TipeMBR["PO"] : client_1.TipeMBR["PS"],
                            jumlah: parseInt(mbr.jumlah)
                        });
                    });
                });
                const createDetailPermintaan = yield tx.detailpermintaanmbr.createMany({
                    data: listMBR
                });
                if (createDetailPermintaan.count > 0) {
                    return {
                        requestMBR: result,
                        detailPermintaan: listMBR
                    };
                }
                else {
                    return null;
                }
            }));
            return { data: { requestRB: transactionRequest.requestMBR, detailPermintaan: transactionRequest.detailPermintaan } };
        }
        catch (error) {
            // console.log({error, data})
            throw error;
        }
    });
}
//ANCHOR - Tanda Permintaan RB Sebagai Digunakan
function set_request_used(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateRequest = yield prisma.permintaan.update({
                where: {
                    id: id
                },
                data: {
                    used: true
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
//ANCHOR - Get Permintaan RB berdasarkan bagian
function get_request_by_bagian(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            const getRequest = yield prisma.permintaan.findMany({
                where: {
                    idBagianCreated: (_a = data.idBagian) !== null && _a !== void 0 ? _a : undefined,
                    AND: [
                        {
                            OR: [
                                {
                                    idPermintaanUsersCreatedFK: {
                                        nama: {
                                            contains: (_b = data.keyword) !== null && _b !== void 0 ? _b : ""
                                        }
                                    }
                                },
                                {
                                    idPermintaanUsersCreatedFK: {
                                        nik: {
                                            contains: (_c = data.keyword) !== null && _c !== void 0 ? _c : ""
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            status: data.status == null ? undefined : data.status
                        },
                        {
                            used: (_d = data.used) !== null && _d !== void 0 ? _d : undefined
                        }
                    ]
                },
                select: {
                    id: true,
                    idCreated: true,
                    timeCreated: true,
                    idBagianCreated: true,
                    idBagianCreatedFK: {
                        select: {
                            namaBagian: true
                        }
                    },
                    idConfirmed: true,
                    idPermintaanUsersConfirmedFK: {
                        select: {
                            nama: true
                        }
                    },
                    timeConfirmed: true,
                    status: true,
                    idPermintaanUsersCreatedFK: {
                        select: {
                            nik: true,
                            nama: true
                        }
                    },
                    reason: true,
                    used: true
                },
                orderBy: {
                    timeCreated: "desc"
                },
                skip: (_e = data.offset) !== null && _e !== void 0 ? _e : undefined,
                take: (_f = data.limit) !== null && _f !== void 0 ? _f : undefined
            });
            const result = Array();
            getRequest.map(item => {
                var _a, _b, _c, _d, _e, _f;
                result.push({
                    id: item.id,
                    idCreated: item.idCreated,
                    namaCreated: (_a = item.idPermintaanUsersCreatedFK) === null || _a === void 0 ? void 0 : _a.nama,
                    nikCreated: (_b = item.idPermintaanUsersCreatedFK) === null || _b === void 0 ? void 0 : _b.nik,
                    idBagianCreated: item.idBagianCreated,
                    namaBagianCreated: (_c = item.idBagianCreatedFK) === null || _c === void 0 ? void 0 : _c.namaBagian,
                    timeCreated: (_d = item.timeCreated) === null || _d === void 0 ? void 0 : _d.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    idConfirmed: item.idConfirmed,
                    namaConfirmed: (_e = item.idPermintaanUsersConfirmedFK) === null || _e === void 0 ? void 0 : _e.nama,
                    timeConfirmed: (_f = item.timeConfirmed) === null || _f === void 0 ? void 0 : _f.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    used: item.used,
                    reason: item.reason,
                    status: item.status
                });
            });
            const count = yield prisma.permintaan.count({
                where: {
                    idBagianCreated: (_g = data.idBagian) !== null && _g !== void 0 ? _g : undefined,
                    AND: [
                        {
                            OR: [
                                {
                                    idPermintaanUsersCreatedFK: {
                                        nama: {
                                            contains: (_h = data.keyword) !== null && _h !== void 0 ? _h : ""
                                        }
                                    }
                                },
                                {
                                    idPermintaanUsersCreatedFK: {
                                        nik: {
                                            contains: (_j = data.keyword) !== null && _j !== void 0 ? _j : ""
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            status: data.status == null ? undefined : data.status
                        },
                        {
                            used: (_k = data.used) !== null && _k !== void 0 ? _k : undefined
                        }
                    ]
                },
            });
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Get Detail Permintaan RB Berdasarkan ID
function get_request_by_id(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getRequest = yield prisma.detailpermintaanmbr.findMany({
                where: {
                    idPermintaanMbr: id
                },
                select: {
                    idPermintaanMbr: true,
                    idProduk: true,
                    nomorMBR: true,
                    tipeMBR: true,
                    jumlah: true
                }
            });
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = {
                id: id,
                data: Array()
            };
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
            d.idPermintaanMbr AS "id",
            d.idProduk,
            p.namaProduk,
            DAY(r.timeCreated) AS "tanggal",
            MONTH(r.timeCreated) AS "bulan",
            YEAR(r.timeCreated) AS "tahun",
            MIN(n.nomorUrut) AS "nomorAwal",
            MAX(n.nomorUrut) AS "nomorAkhir",
            COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) AS "RBBelumKembali"
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
            
        ${status == "belum" ? `HAVING COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
        ${limit != null && offset != null ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;
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
                ${(startDate !== null && endDate !== null) ? `AND (
		        ( YEAR ( r.timeCreated ) = ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		        AND ( YEAR ( r.timeCreated ) = ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	            )` : ""}
            GROUP BY
                d.idPermintaanMbr
            ${status == "belum" ? `HAVING COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
            ) as subquery`;
            const getCount = yield prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                result.push({
                    id: String(item.id),
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal}-${item.bulan} `,
                    tahun: item.tahun,
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali)
                });
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
            DAY(r.timeCreated) AS "tanggal",
            MONTH(r.timeCreated) AS "bulan",
            YEAR(r.timeCreated) AS "tahun",
            MIN(n.nomorUrut) AS "nomorAwal",
            MAX(n.nomorUrut) AS "nomorAkhir",
            COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) AS "RBBelumKembali"
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
        ${status == "belum" ? `HAVING COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}`;
            const getRequest = yield prisma.$queryRaw(client_1.Prisma.sql([query]));
            if (getRequest == null) {
                return { data: "Data Permintaan tidak ditemukan" };
            }
            const result = Array();
            getRequest.map(item => {
                result.push({
                    id: String(item.id),
                    tipeMBR: item.tipeMBR,
                    nomorMBR: item.nomorMBR,
                    namaProduk: item.namaProduk,
                    tanggalBulan: `${item.tanggal} -${item.bulan} `,
                    tahun: item.tahun,
                    nomorAwal: item.nomorAwal,
                    nomorAkhir: item.nomorAkhir,
                    RBBelumKembali: String(item.RBBelumKembali)
                });
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
//ANCHOR - Check Id User Not Null
function check_id_user_not_null(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkUser = yield prisma.nomormbr.findFirst({
                where: {
                    id: id
                },
                select: {
                    idUserTerima: true
                }
            });
            return (checkUser === null || checkUser === void 0 ? void 0 : checkUser.idUserTerima) != null;
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Check Product same with Bagian
function check_product_same_department(idProduct, idBagian) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkProduct = yield prisma.produk.findFirst({
                where: {
                    id: idProduct
                },
                select: {
                    idBagian: true
                }
            });
            return (checkProduct === null || checkProduct === void 0 ? void 0 : checkProduct.idBagian) === idBagian;
        }
        catch (error) {
            throw error;
        }
    });
}
