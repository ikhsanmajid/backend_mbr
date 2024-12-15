import { PrismaClient, Prisma, TipeMBR, Konfirmasi, Status } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";


//SECTION - Product Model Admin
const prisma = new PrismaClient();

interface RequestRB {
    id?: number | string;
    oldid?: number;
    idCreated?: number | string;
    namaCreated?: string;
    nikCreated?: string;
    idBagianCreated?: number | string;
    namaBagianCreated?: string;
    timeCreated?: string | Date;
    idConfirmed?: number | string;
    timeConfirmed?: string | Date;
    namaConfirmed?: string;
    status?: Konfirmasi;
    used?: boolean;
    reason?: string | null;
    data?: Array<{
        idProduk: string;
        mbr: [{
            group_id: number,
            no_mbr: string;
            tipe_mbr: string;
            jumlah: string;
        }]
    }>;
}

interface ReturnRBQuery {
    id: string,
    nomorMBR?: string,
    tipeMBR?: TipeMBR,
    namaProduk: string,
    tanggal?: number,
    bulan?: number,
    tahun?: string | number,
    nomorAwal: number,
    nomorAkhir: number,
    RBBelumKembali: string
}

interface ReturnRBResult extends ReturnRBQuery {
    tanggalBulan: string
}


interface DetailPermintaan {
    idPermintaanMbr: number,
    idProduk: number,
    group_id: number,
    nomorMBR: string,
    tipeMBR: TipeMBR,
    jumlah: number
}

interface ReturnNomorRBResult {
    id: number;
    nomorUrut: string;
    status: Status;
    tanggalKembali: string | null | undefined;
    idUserTerima?: number | null;
    idUserTerimaFK?: {
        nama: string | null | undefined
    };
    namaUserTerima?: string | null | undefined;
    nomorBatch: string | null;
    tahun?: number;
}

export interface ILaporanSerahTerimaRB {
    namaProduk: string;
    tipeMBR: TipeMBR;
    nomorMBR: string;
    nomorBatch: string;
    status: Status;
    nomorUrut: string;
    namaBagian: string;
}



//ANCHOR - Tambah Permintaan RB
export async function add_request(data: RequestRB): Promise<ResultModel<{ requestRB: RequestRB, detailPermintaan: DetailPermintaan[] } | null>> {
    try {
        const transactionRequest = await prisma.$transaction(async (tx: Prisma.TransactionClient): Promise<{ requestMBR: RequestRB, detailPermintaan: DetailPermintaan[] } | null> => {
            const addRequestRB = await tx.permintaan.create({
                data: {
                    idCreated: parseInt(data.idCreated!.toString()),
                    idBagianCreated: parseInt(data.idBagianCreated!.toString()),
                    timeCreated: data.timeCreated!,
                },
                select: {
                    id: true,
                    idCreated: true,
                    timeCreated: true
                }
            })

            const result: RequestRB = {
                id: addRequestRB.id,
                idCreated: addRequestRB.idCreated!,
                timeCreated: addRequestRB.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
            }

            const listMBR: DetailPermintaan[] = Array()

            data.data!.map((item, index) => {
                item.mbr.map(mbr => {
                    listMBR.push({
                        idPermintaanMbr: parseInt(result.id!.toString()),
                        idProduk: parseInt(item.idProduk),
                        group_id: index,
                        nomorMBR: mbr.no_mbr.trim(),
                        tipeMBR: mbr.tipe_mbr == "PO" ? TipeMBR["PO"] : TipeMBR["PS"],
                        jumlah: parseInt(mbr.jumlah)
                    })
                })

            })


            const createDetailPermintaan = await tx.detailpermintaanmbr.createMany({
                data: listMBR
            })

            if (createDetailPermintaan.count > 0) {
                return {
                    requestMBR: result,
                    detailPermintaan: listMBR
                }
            } else {
                return null
            }

        })

        return { data: { requestRB: transactionRequest!.requestMBR, detailPermintaan: transactionRequest!.detailPermintaan } }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Edit Permintaan RB
export async function edit_request(data: RequestRB): Promise<ResultModel<{ requestRB: RequestRB, detailPermintaan: DetailPermintaan[] } | null>> {
    try {
        const transactionRequest = await prisma.$transaction(async (tx: Prisma.TransactionClient): Promise<{ requestMBR: RequestRB, detailPermintaan: DetailPermintaan[] } | null> => {
            const deleteOldRequest = await tx.permintaan.delete({
                where: {
                    id: data.oldid!
                }
            })

            const addRequestRB = await tx.permintaan.create({
                data: {
                    idCreated: parseInt(data.idCreated!.toString()),
                    idBagianCreated: parseInt(data.idBagianCreated!.toString()),
                    timeCreated: data.timeCreated!,
                },
                select: {
                    id: true,
                    idCreated: true,
                    timeCreated: true
                }
            })

            const result: RequestRB = {
                id: addRequestRB.id,
                idCreated: addRequestRB.idCreated!,
                timeCreated: addRequestRB.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
            }

            const listMBR: DetailPermintaan[] = Array()

            data.data!.map((item, index) => {
                item.mbr.map(mbr => {
                    listMBR.push({
                        idPermintaanMbr: parseInt(result.id!.toString()),
                        idProduk: parseInt(item.idProduk),
                        group_id: index,
                        nomorMBR: mbr.no_mbr.trim(),
                        tipeMBR: mbr.tipe_mbr == "PO" ? TipeMBR["PO"] : TipeMBR["PS"],
                        jumlah: parseInt(mbr.jumlah.trim())
                    })
                })

            })


            const createDetailPermintaan = await tx.detailpermintaanmbr.createMany({
                data: listMBR
            })

            if (createDetailPermintaan.count > 0) {
                return {
                    requestMBR: result,
                    detailPermintaan: listMBR
                }
            } else {
                return null
            }

        })

        return { data: { requestRB: transactionRequest!.requestMBR, detailPermintaan: transactionRequest!.detailPermintaan } }

    } catch (error) {
        // console.log({error, data})
        throw error
    }
}

//ANCHOR - Tanda Permintaan RB Sebagai Digunakan
export async function set_request_used(id: number): Promise<ResultModel<boolean> | { data: string }> {
    try {
        const updateRequest = await prisma.permintaan.update({
            where: {
                id: id
            },
            data: {
                used: true
            }
        })

        if (updateRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        return { data: true }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Permintaan RB berdasarkan bagian
export async function get_request_by_bagian(data: { idBagian: number | null, year: number | null, keyword: string | null, status: Konfirmasi | null, idProduk: number | null, used: boolean | null, limit: number | null, offset: number | null }): Promise<ResultModel<RequestRB[] | null> | { data: string }> {
    try {
        const year = new Date().getFullYear()

        const query = `SELECT 
            r.id,
            r.idCreated,
            r.timeCreated,
            r.idBagianCreated,
            b.namaBagian AS namaBagianCreated,
            r.idConfirmed,
            ucr.nama AS namaCreated,
            uc.nama AS namaConfirmed,
            r.timeConfirmed,
            ucr.nik AS nikCreated,
            r.reason,
            r.used,
            r.status
        FROM 
            permintaan r
            JOIN bagian b ON r.idBagianCreated = b.id
            JOIN users ucr ON r.idCreated = ucr.id 
            LEFT JOIN users uc ON r.idConfirmed = uc.id
            JOIN detailpermintaanmbr d ON r.id = d.idPermintaanMbr
            JOIN produk p ON d.idProduk = p.id
        WHERE 
            1=1
            ${data.idBagian ? ` AND r.idBagianCreated = ${data.idBagian}` : ''}
            ${(data.keyword !== null) ? `AND (
                ucr.nama LIKE '%${data.keyword}%' OR
                ucr.nik LIKE '%${data.keyword}%'
            )` : ""}            
            ${(data.idProduk !== null) ? `AND p.id = ${data.idProduk}` : ""}
            ${(data.status !== null) ? `AND r.status = '${data.status}'` : ""}
            ${(data.used !== null) ? `AND r.used = ${data.used}` : ""}
            AND YEAR(r.timeCreated) = ${data.year ?? year}
        GROUP BY 
            r.id, r.idCreated, r.timeCreated, r.idBagianCreated, b.namaBagian, 
            r.idConfirmed, r.timeConfirmed, r.STATUS, r.reason, r.used
        ORDER BY 
            r.timeCreated DESC
        LIMIT ${data.limit ?? ''}
        OFFSET ${data.offset ?? ''}`

        const getRequest = await prisma.$queryRaw<RequestRB[]>(Prisma.sql([query]))

        const result: RequestRB[] = Array()

        getRequest.map(item => {
            result.push({
                id: String(item.id),
                idCreated: String(item.idCreated),
                namaCreated: item.namaCreated,
                nikCreated: item.nikCreated,
                idBagianCreated: String(item.idBagianCreated),
                namaBagianCreated: item.namaBagianCreated,
                timeCreated: item.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                idConfirmed: String(item.idConfirmed!),
                namaConfirmed: item.namaConfirmed,
                timeConfirmed: item.timeConfirmed?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                used: item.used,
                reason: item.reason,
                status: item.status
            })
        })

        const queryCount = `SELECT 
                COUNT(*) as "count"
            FROM (
                SELECT
                    r.id AS id
                FROM
                    permintaan r
                JOIN users ucr ON r.idCreated = ucr.id 
                JOIN detailpermintaanmbr d ON r.id = d.idPermintaanMbr
                JOIN produk p ON d.idProduk = p.id
                WHERE 
                1=1
                    ${data.idBagian ? ` AND r.idBagianCreated = ${data.idBagian}` : ''}
                    ${(data.keyword !== null) ? `AND (
                        ucr.nama LIKE '%${data.keyword}%' OR
                        ucr.nik LIKE '%${data.keyword}%'
                    )` : ""}            
                    ${(data.idProduk !== null) ? `AND p.id = ${data.idProduk}` : ""}
                    ${(data.status !== null) ? `AND r.status = '${data.status}'` : ""}
                    ${(data.used !== null) ? `AND r.used = ${data.used}` : ""}
                    AND YEAR(r.timeCreated) = ${data.year ?? year}
                GROUP BY
                    r.id
            ) as subquery;`

        const count = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([queryCount]))

        //console.log(count)

        return { data: result, count: Number(count[0].count) }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Detail Permintaan RB Berdasarkan ID
export async function get_request_by_id(id: number): Promise<ResultModel<RequestRB | null> | { data: string }> {
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
        })

        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: RequestRB = {
            id: id,
            data: Array()
        }

        return { data: result }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
export async function get_rb_return_by_product(id: number, status: string | null, numberFind: string | null, limit: number | null, offset: number | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
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
		    ( YEAR ( r.timeCreated ) >= ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		    AND ( YEAR ( r.timeCreated ) <= ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	        )` : ""}
        GROUP BY
            p.namaProduk, r.timeCreated, d.idProduk, d.idPermintaanMbr 
        HAVING 
        1=1           
        ${status == "belum" ? ` AND COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
        ${(numberFind !== null) ? ` AND SUM(CASE WHEN n.nomorUrut LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
        ${limit != null && offset != null ? `LIMIT ${limit} OFFSET ${offset}` : ""}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

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
		        ( YEAR ( r.timeCreated ) >= ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		        AND ( YEAR ( r.timeCreated ) <= ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	            )` : ""}
            GROUP BY
                d.idPermintaanMbr
            HAVING
            1=1
            ${(numberFind !== null) ? ` AND SUM(CASE WHEN n.nomorUrut LIKE '%${numberFind}' THEN 1 ELSE 0 END) > 0` : ""}
            ${status == "belum" ? ` AND COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
            ) as subquery`

        const getCount = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([countQuery]))


        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            result.push({
                id: String(item.id),
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali)

            })
        })

        //console.log(getCount[0].count.toString())

        return { data: result, count: getCount[0].count }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Permintaan RB Return Berdasarkan Produk dan Permintaan
export async function get_rb_return_by_product_and_permintaan(id: number, idPermintaan: number, status: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
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
        ${status == "belum" ? `HAVING COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            result.push({
                id: String(item.id),
                tipeMBR: item.tipeMBR,
                nomorMBR: item.nomorMBR,
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal} -${item.bulan} `,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali)
            })
        })

        return { data: result }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Permintaan RB Return Berdasarkan ID Permintaan
export async function get_rb_return_by_id_permintaan(idPermintaan: number, limit: number | null, offset: number | null): Promise<ResultModel<ReturnNomorRBResult[] | null> | { data: string }> {
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
        })

        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnNomorRBResult[] = Array()

        getRequest.map(item => {
            result.push({
                id: item.id,
                nomorUrut: item.nomorUrut,
                status: item.status,
                tanggalKembali: item.tanggalKembali?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                namaUserTerima: item.idUserTerimaFK?.nama,
                nomorBatch: item.nomorBatch,
            })
        })

        const getCount = await prisma.nomormbr.count({
            where: {
                idDetailPermintaan: idPermintaan
            }
        })

        return { data: result, count: getCount }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Update Nomor RB Return
export async function set_nomor_rb_return(id: number, data: { status: Status | undefined, nomor_batch: undefined | null | string, tanggal_kembali: string | null | undefined }): Promise<ResultModel<boolean> | { data: string }> {
    try {
        const updateRequest = await prisma.nomormbr.update({
            where: {
                id: id
            },
            data: {
                nomorBatch: data.nomor_batch,
                status: data.status,
                tanggalKembali: data.tanggal_kembali
            }
        })

        if (updateRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        return { data: true }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Check Id User Not Null
export async function check_id_user_not_null(id: number): Promise<boolean> {
    try {
        const checkUser = await prisma.nomormbr.findFirst({
            where: {
                id: id
            },
            select: {
                idUserTerima: true
            }
        })

        return checkUser?.idUserTerima != null
    } catch (error) {
        throw error
    }
}

//ANCHOR - Check Product same with Bagian
export async function check_product_same_department(idProduct: number, idBagian: number): Promise<boolean> {
    try {
        const checkProduct = await prisma.produk.findFirst({
            where: {
                id: idProduct
            },
            select: {
                idBagian: true
            }
        })

        return checkProduct?.idBagian === idBagian
    } catch (error) {
        throw error
    }
}

//AND - Generate Report Dashboard User
//ANCHOR - Generate Report Dashboard Admin
export async function generate_report_dashboard_user(idBagian: number): Promise<ResultModel<{ RBBelumKembali: { count: number | string, namaBagian: string }[], RBDibuat: { count: number | string, namaBagian: string }[] } | null | { data: string }>> {
    try {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const formattedDate = twoMonthsAgo.toLocaleDateString("id-ID", {
            month: '2-digit',  // mm
            year: 'numeric'   // yyyy
        });

        const bulanTahun = formattedDate.split("/")

        const dateNow = new Date();
        const yearNow = dateNow.getFullYear()

        //console.log(bulanTahun)

        const query = `SELECT
                COUNT(CASE 
                        WHEN n.status = 'ACTIVE'
                        AND ((MONTH(r.timeCreated) <= ${bulanTahun[0]} AND YEAR(r.timeCreated) <= ${bulanTahun[1]}) OR r.timeCreated IS NULL)
                        THEN 1 
                        ELSE NULL 
                    END) AS count,
                    b.namaBagian
                FROM
                    bagian b
                    LEFT JOIN permintaan r ON b.id = r.idBagianCreated
                    LEFT JOIN detailpermintaanmbr d ON r.id = d.idPermintaanMbr
                    LEFT JOIN nomormbr n ON d.id = n.idDetailPermintaan
                WHERE
                    b.id = ${idBagian}
                GROUP BY
                b.namaBagian;`

        const getRequest = await prisma.$queryRaw<{ count: number, namaBagian: string }[]>(Prisma.sql([query]))

        const result = getRequest.map(item => ({
            count: String(item.count),
            namaBagian: item.namaBagian
        }))

        const queryRBDibuat = `SELECT
                    COUNT(
                    CASE
                            WHEN n.id IS NOT NULL 
                            AND ( YEAR ( r.timeCreated ) = ${yearNow} OR r.timeCreated IS NULL ) THEN
                                1 ELSE NULL 
                            END 
                            ) AS count,
                            b.namaBagian 
                        FROM
                            permintaan r
                            LEFT JOIN bagian b ON r.idBagianCreated = b.id
                            JOIN detailpermintaanmbr d ON r.id = d.idPermintaanMbr
                            JOIN nomormbr n ON d.id = n.idDetailPermintaan

                        WHERE
                            b.id = ${idBagian}`

        const getRequestRBDibuat = await prisma.$queryRaw<{ count: number, namaBagian: string }[]>(Prisma.sql([queryRBDibuat]))
        const resultRBDibuat = new Array()

        getRequestRBDibuat.map(item => {
            resultRBDibuat.push({
                count: String(item.count),
                namaBagian: item.namaBagian
            })
        })

        return {
            data: {
                RBBelumKembali: result,
                RBDibuat: resultRBDibuat
            }
        }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Generate Report Serah Terima
export async function generate_report_serah_terima(idBagian: number, startDate: string | null, endDate: string | null): Promise<ResultModel<ILaporanSerahTerimaRB[] | null> | { data: string }> {
    try {
        const query = `SELECT
                p.namaProduk,
                d.tipeMBR,
                d.nomorMBR,
                n.nomorBatch,
                n.nomorUrut,
                b.namaBagian
            FROM
                permintaan r
                JOIN detailpermintaanmbr d ON d.idPermintaanMbr = r.id
                JOIN produk p ON d.idProduk = p.id
                JOIN nomormbr n ON n.idDetailPermintaan = d.id
                JOIN bagian b ON r.idBagianCreated = b.id
                JOIN kategori k ON k.id = p.idKategori
            WHERE
                r.idBagianCreated = ${idBagian}
                AND n.tanggalKembali BETWEEN '${startDate}' AND '${endDate}'
                AND n.status IN ('KEMBALI', 'BATAL')
            ORDER BY
                k.namaKategori ASC,
                p.namaProduk ASC,    
                n.nomorBatch ASC,
                d.tipeMBR ASC,
                n.nomorUrut ASC; `

        const getRequest = await prisma.$queryRaw<ILaporanSerahTerimaRB[]>(Prisma.sql([query]))

        if (getRequest.length == 0) {
            return { data: null }
        }

        return { data: getRequest }
    } catch (error) {
        throw error
    }
}