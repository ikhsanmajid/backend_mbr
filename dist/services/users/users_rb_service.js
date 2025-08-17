"use strict";
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
exports.generate_report_dashboard_user = generate_report_dashboard_user;
exports.generate_report_serah_terima = generate_report_serah_terima;
const client_1 = require("@prisma/client");
//SECTION - Product Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Tambah Permintaan RB
async function add_request(data) {
    try {
        const transactionRequest = await prisma.$transaction(async (tx) => {
            const addRequestRB = await tx.permintaan.create({
                data: {
                    idCreated: parseInt(data.idCreated.toString()),
                    idBagianCreated: parseInt(data.idBagianCreated.toString()),
                    timeCreated: data.timeCreated,
                },
                select: {
                    id: true,
                    idCreated: true,
                    idPermintaanUsersCreatedFK: {
                        select: {
                            nama: true,
                        }
                    },
                    idBagianCreatedFK: {
                        select: {
                            namaBagian: true
                        }
                    },
                    timeCreated: true
                }
            });
            const result = {
                id: Number(addRequestRB.id),
                idCreated: addRequestRB.idCreated,
                namaCreated: addRequestRB.idPermintaanUsersCreatedFK?.nama,
                namaBagianCreated: addRequestRB.idBagianCreatedFK.namaBagian,
                timeCreated: addRequestRB.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
            };
            const listMBR = Array();
            data.data.map((item, index) => {
                item.mbr.map(mbr => {
                    listMBR.push({
                        idPermintaanMbr: parseInt(result.id.toString()),
                        idProduk: parseInt(item.idProduk),
                        group_id: index,
                        nomorMBR: mbr.no_mbr.trim(),
                        tipeMBR: mbr.tipe_mbr == "PO" ? client_1.TipeMBR["PO"] : client_1.TipeMBR["PS"],
                        jumlah: parseInt(mbr.jumlah)
                    });
                });
            });
            const createDetailPermintaan = await tx.detailpermintaanmbr.createMany({
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
        });
        return { data: { requestRB: transactionRequest.requestMBR, detailPermintaan: transactionRequest.detailPermintaan } };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Edit Permintaan RB
async function edit_request(data) {
    try {
        const transactionRequest = await prisma.$transaction(async (tx) => {
            const deleteOldRequest = await tx.detailpermintaanmbr.deleteMany({
                where: {
                    idPermintaanMbr: data.oldid
                }
            });
            const updateRequestRB = await tx.permintaan.update({
                data: {
                    idConfirmed: null,
                    reason: null,
                    timeConfirmed: null,
                    status: "PENDING"
                },
                select: {
                    id: true,
                    idPermintaanUsersCreatedFK: {
                        select: {
                            nama: true,
                        }
                    },
                    idBagianCreatedFK: {
                        select: {
                            namaBagian: true
                        }
                    },
                },
                where: {
                    id: data.oldid
                }
            });
            const result = {
                id: Number(updateRequestRB.id),
                namaCreated: updateRequestRB.idPermintaanUsersCreatedFK?.nama,
                namaBagianCreated: updateRequestRB.idBagianCreatedFK.namaBagian,
            };
            const listMBR = Array();
            data.data.map((item, index) => {
                item.mbr.map(mbr => {
                    listMBR.push({
                        idPermintaanMbr: parseInt(result.id.toString()),
                        idProduk: parseInt(item.idProduk),
                        group_id: index,
                        nomorMBR: mbr.no_mbr.trim(),
                        tipeMBR: mbr.tipe_mbr == "PO" ? client_1.TipeMBR["PO"] : client_1.TipeMBR["PS"],
                        jumlah: parseInt(mbr.jumlah)
                    });
                });
            });
            const createDetailPermintaan = await tx.detailpermintaanmbr.createMany({
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
        });
        return { data: { requestRB: transactionRequest.requestMBR, detailPermintaan: transactionRequest.detailPermintaan } };
    }
    catch (error) {
        // console.log({error, data})
        throw error;
    }
}
//ANCHOR - Tanda Permintaan RB Sebagai Digunakan
async function set_request_used(id) {
    try {
        const updateRequest = await prisma.permintaan.update({
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
}
//ANCHOR - Get Permintaan RB berdasarkan bagian
async function get_request_by_bagian(data) {
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
        JOIN 
            "bagian" b ON r."idBagianCreated" = b."id"
        JOIN 
            "users" ucr ON r."idCreated" = ucr."id"
        LEFT JOIN 
            "users" uc ON r."idConfirmed" = uc."id"
        JOIN 
            "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
        JOIN 
            "produk" p ON d."idProduk" = p."id"
        WHERE 
            1 = 1
            ${data.idBagian ? ` AND r."idBagianCreated" = ${data.idBagian}` : ''}
            ${(data.keyword !== null) ? `AND (
                ucr."nama" ILIKE '%${data.keyword}%' OR
                ucr."nik" ILIKE '%${data.keyword}%'
            )` : ""}            
            ${(data.idProduk !== null) ? `AND p."id" = ${data.idProduk}` : ""}
            ${(data.status !== null) ? `AND r."status" = '${data.status}'` : ""}
            ${(data.used !== null) ? `AND r."used" = ${data.used}` : ""}
            AND EXTRACT(YEAR FROM r."timeCreated") = ${data.year ?? year}
        GROUP BY 
            r."id", r."idCreated", r."timeCreated", r."idBagianCreated", b."namaBagian", 
            r."idConfirmed", r."timeConfirmed", r."status", r."reason", r."used", ucr."nama", uc."nama", ucr."nik"
        ORDER BY 
            r."timeCreated" DESC
        ${data.limit !== null ? ` LIMIT ${data.limit}` : ''}
        ${data.offset !== null ? ` OFFSET ${data.offset}` : ''}`;
        const getRequest = await prisma.$queryRaw(client_1.Prisma.sql([query]));
        const result = Array();
        getRequest.map(item => {
            result.push({
                id: String(item.id),
                idCreated: String(item.idCreated),
                namaCreated: item.namaCreated,
                nikCreated: item.nikCreated,
                idBagianCreated: String(item.idBagianCreated),
                namaBagianCreated: item.namaBagianCreated,
                timeCreated: item.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                idConfirmed: String(item.idConfirmed),
                namaConfirmed: item.namaConfirmed,
                timeConfirmed: item.timeConfirmed?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                used: item.used,
                reason: item.reason,
                status: item.status
            });
        });
        const queryCount = `SELECT 
            COUNT(*) as "count"
        FROM (
            SELECT
                r."id" AS "id"
            FROM
                "permintaan" r
            JOIN "users" ucr ON r."idCreated" = ucr."id" 
            JOIN "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
            JOIN "produk" p ON d."idProduk" = p."id"
            WHERE 
                1=1
                ${data.idBagian ? ` AND r."idBagianCreated" = ${data.idBagian}` : ''}
                ${(data.keyword !== null) ? `AND (
                    ucr."nama" LIKE '%${data.keyword}%' OR
                    ucr."nik" LIKE '%${data.keyword}%'
                )` : ""}            
                ${(data.idProduk !== null) ? `AND p."id" = ${data.idProduk}` : ""}
                ${(data.status !== null) ? `AND r."status" = '${data.status}'` : ""}
                ${(data.used !== null) ? `AND r."used" = ${data.used}` : ""}
                AND EXTRACT(YEAR FROM r."timeCreated") = ${data.year ?? year}
            GROUP BY
                r."id"
        ) AS "subquery";`;
        const count = await prisma.$queryRaw(client_1.Prisma.sql([queryCount]));
        //console.log(count)
        return { data: result, count: Number(count[0].count) };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Get Detail Permintaan RB Berdasarkan ID
async function get_request_by_id(id) {
    try {
        const getRequest = await prisma.detailpermintaanmbr.findMany({
            where: {
                idPermintaanMbr: id
            },
            select: {
                idPermintaanMbr: true,
                idProduk: true,
                nomorMBR: true,
                tipeMBR: true,
                jumlah: true,
                idPermintaanMBR: {
                    select: {
                        status: true,
                    }
                }
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
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
async function get_rb_return_by_product(id, status, numberFind, limit, offset, startDate, endDate) {
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
                EXTRACT(YEAR FROM r."timeCreated") >= ${startDate.split("-")[1]} 
                AND EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]} 
                AND EXTRACT(YEAR FROM r."timeCreated") <= ${endDate.split("-")[1]} 
                AND EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}
            )` : ""}
        GROUP BY
            d."idPermintaanMbr", d."idProduk", p."namaProduk", r."timeCreated"
        HAVING 
            1=1
            ${status == "belum" ? `AND COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0` : ""}
            ${(numberFind !== null) ? `AND SUM(CASE WHEN n."nomorUrut" LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
            ${limit != null && offset != null ? `LIMIT ${limit} OFFSET ${offset}` : ""}`;
        const getRequest = await prisma.$queryRaw(client_1.Prisma.sql([query]));
        const countQuery = `SELECT COUNT(*) AS "count"
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
                d."idProduk" = ${id}
                ${(startDate !== null && endDate !== null) ? `AND (
                    EXTRACT(YEAR FROM r."timeCreated") >= ${startDate.split("-")[1]} 
                    AND EXTRACT(MONTH FROM r."timeCreated") >= ${startDate.split("-")[0]} 
                    AND EXTRACT(YEAR FROM r."timeCreated") <= ${endDate.split("-")[1]} 
                    AND EXTRACT(MONTH FROM r."timeCreated") <= ${endDate.split("-")[0]}
                )` : ""}
            GROUP BY
                d."idPermintaanMbr"
            HAVING
                1 = 1
                ${(numberFind !== null) ? `AND SUM(CASE WHEN n."nomorUrut" LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
                ${status == "belum" ? `AND COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0` : ""}
        ) AS subquery;`;
        const getCount = await prisma.$queryRaw(client_1.Prisma.sql([countQuery]));
        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" };
        }
        const result = Array();
        getRequest.map(item => {
            result.push({
                id: String(item.id),
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
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
}
//ANCHOR - Get Permintaan RB Return Berdasarkan Produk dan Permintaan
async function get_rb_return_by_product_and_permintaan(id, idPermintaan, status) {
    try {
        const query = `
                SELECT
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
            d."id", d."nomorMBR", d."tipeMBR", p."namaProduk", r."timeCreated"
        ${status == "belum" ? `HAVING COUNT(CASE WHEN n."status" = 'ACTIVE' THEN 1 END) > 0` : ""}`;
        const getRequest = await prisma.$queryRaw(client_1.Prisma.sql([query]));
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
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
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
}
//ANCHOR - Get Permintaan RB Return Berdasarkan ID Permintaan
async function get_rb_return_by_id_permintaan(idPermintaan, limit, offset) {
    try {
        const getRequest = await prisma.nomormbr.findMany({
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
            skip: offset ?? undefined,
            take: limit ?? undefined
        });
        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" };
        }
        const result = Array();
        getRequest.map(item => {
            result.push({
                id: Number(item.id),
                nomorUrut: item.nomorUrut,
                status: item.status,
                tanggalKembali: item.tanggalKembali?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                namaUserTerima: item.idUserTerimaFK?.nama,
                nomorBatch: item.nomorBatch,
            });
        });
        const getCount = await prisma.nomormbr.count({
            where: {
                idDetailPermintaan: idPermintaan
            }
        });
        return { data: result, count: getCount };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Update Nomor RB Return
async function set_nomor_rb_return(id, data) {
    try {
        const updateRequest = await prisma.nomormbr.update({
            where: {
                id: id
            },
            data: {
                idUserKembali: data.idUser,
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
}
//ANCHOR - Check Id User Not Null
async function check_id_user_not_null(id) {
    try {
        const checkUser = await prisma.nomormbr.findFirst({
            where: {
                id: id
            },
            select: {
                idUserTerima: true
            }
        });
        return checkUser?.idUserTerima != null;
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Check Product same with Bagian
async function check_product_same_department(idProduct, idBagian) {
    try {
        const checkProduct = await prisma.produk.findFirst({
            where: {
                id: idProduct
            },
            select: {
                idBagian: true
            }
        });
        return checkProduct?.idBagian === idBagian;
    }
    catch (error) {
        throw error;
    }
}
//AND - Generate Report Dashboard User
//ANCHOR - Generate Report Dashboard Admin
async function generate_report_dashboard_user(idBagian) {
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
                    WHEN n."status" = 'ACTIVE'
                    AND (
                        (EXTRACT(MONTH FROM r."timeCreated") <= ${bulanTahun[0]} AND EXTRACT(YEAR FROM r."timeCreated") <= ${bulanTahun[1]})
                        OR r."timeCreated" IS NULL
                    )
                    THEN 1 
                    ELSE NULL 
                END) AS "count",
            b."namaBagian"
        FROM
            "bagian" b
        LEFT JOIN 
            "permintaan" r ON b."id" = r."idBagianCreated"
        LEFT JOIN 
            "detailpermintaanmbr" d ON r."id" = d."idPermintaanMbr"
        LEFT JOIN 
            "nomormbr" n ON d."id" = n."idDetailPermintaan"
        WHERE
            b."id" = ${idBagian}
        GROUP BY
            b."namaBagian";`;
        const getRequest = await prisma.$queryRaw(client_1.Prisma.sql([query]));
        const result = getRequest.map(item => ({
            count: String(item.count),
            namaBagian: item.namaBagian
        }));
        // const queryRBDibuat = `SELECT
        //             COUNT(
        //             CASE
        //                     WHEN n.id IS NOT NULL 
        //                     AND ( YEAR ( r.timeCreated ) = ${yearNow} OR r.timeCreated IS NULL ) THEN
        //                         1 ELSE NULL 
        //                     END 
        //                     ) AS count,
        //                     b.namaBagian 
        //                 FROM
        //                     permintaan r
        //                     LEFT JOIN bagian b ON r.idBagianCreated = b.id
        //                     JOIN detailpermintaanmbr d ON r.id = d.idPermintaanMbr
        //                     JOIN nomormbr n ON d.id = n.idDetailPermintaan
        //                 WHERE
        //                     b.id = ${idBagian}`
        const queryRBDibuat = `SELECT
            b."namaBagian",
            (SELECT COUNT(n2."id")
            FROM "permintaan" r2
            LEFT JOIN "detailpermintaanmbr" d2 ON r2."id" = d2."idPermintaanMbr"
            LEFT JOIN "nomormbr" n2 ON d2."id" = n2."idDetailPermintaan"
            WHERE r2."idBagianCreated" = b."id"
            AND (EXTRACT(YEAR FROM r2."timeCreated") = ${yearNow} OR r2."timeCreated" IS NULL)
            AND (n2."id" IS NOT NULL OR r2."timeCreated" IS NULL)
            ) AS "count"
        FROM
            "bagian" b
        WHERE
            b."id" = ${idBagian};`;
        const getRequestRBDibuat = await prisma.$queryRaw(client_1.Prisma.sql([queryRBDibuat]));
        const resultRBDibuat = new Array();
        getRequestRBDibuat.map(item => {
            resultRBDibuat.push({
                count: String(item.count),
                namaBagian: item.namaBagian
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
}
//ANCHOR - Generate Report Serah Terima
async function generate_report_serah_terima(idBagian, idUser, startDate, endDate) {
    try {
        const query = `SELECT
            p."namaProduk",
            d."tipeMBR",
            d."nomorMBR",
            n."nomorBatch",
            n."nomorUrut",
            b."namaBagian"
        FROM
            "permintaan" r
            JOIN "detailpermintaanmbr" d ON d."idPermintaanMbr" = r."id"
            JOIN "produk" p ON d."idProduk" = p."id"
            JOIN "nomormbr" n ON n."idDetailPermintaan" = d."id"
            JOIN "bagian" b ON r."idBagianCreated" = b."id"
            JOIN "kategori" k ON k."id" = p."idKategori"
        WHERE
            r."idBagianCreated" = ${idBagian}
            AND n."idUserKembali" = ${idUser}
            AND n."tanggalKembali" BETWEEN '${startDate}' AND '${endDate}'
            AND n."status" IN ('KEMBALI', 'BATAL')
        ORDER BY
            k."namaKategori" ASC,
            p."namaProduk" ASC,    
            n."nomorBatch" ASC,
            d."tipeMBR" ASC,
            n."nomorUrut" ASC;`;
        const getRequest = await prisma.$queryRaw(client_1.Prisma.sql([query]));
        if (getRequest.length == 0) {
            return { data: null };
        }
        return { data: getRequest };
    }
    catch (error) {
        throw error;
    }
}
