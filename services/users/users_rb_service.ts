import { PrismaClient, Prisma, TipeMBR, Konfirmasi, Status } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";
import { count } from "console";


//SECTION - Product Model Admin
const prisma = new PrismaClient();

interface RequestRB {
    id?: number | string;
    oldid?: number;
    idCreated?: number;
    namaCreated?: string;
    nikCreated?: string;
    idBagianCreated?: number;
    namaBagianCreated?: string;
    timeCreated?: string;
    idConfirmed?: number;
    timeConfirmed?: string;
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
    tahun?: number,
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
                        nomorMBR: mbr.no_mbr,
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
                        nomorMBR: mbr.no_mbr,
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
export async function get_request_by_bagian(data: { idBagian: number | null, keyword: string | null, status: Konfirmasi | null, used: boolean | null, limit: number | null, offset: number | null }): Promise<ResultModel<RequestRB[] | null> | { data: string }> {
    try {
        const getRequest = await prisma.permintaan.findMany({
            where: {
                idBagianCreated: data.idBagian ?? undefined,
                AND: [
                    {
                        OR: [
                            {
                                idPermintaanUsersCreatedFK: {
                                    nama: {
                                        contains: data.keyword ?? ""
                                    }
                                }
                            },
                            {
                                idPermintaanUsersCreatedFK: {
                                    nik: {
                                        contains: data.keyword ?? ""
                                    }
                                }
                            }
                        ]
                    },
                    {
                        status: data.status == null ? undefined : data.status
                    },
                    {
                        used: data.used ?? undefined
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
            skip: data.offset ?? undefined,
            take: data.limit ?? undefined
        })

        const result: RequestRB[] = Array()

        getRequest.map(item => {
            result.push({
                id: item.id,
                idCreated: item.idCreated,
                namaCreated: item.idPermintaanUsersCreatedFK?.nama,
                nikCreated: item.idPermintaanUsersCreatedFK?.nik,
                idBagianCreated: item.idBagianCreated,
                namaBagianCreated: item.idBagianCreatedFK?.namaBagian,
                timeCreated: item.timeCreated?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                idConfirmed: item.idConfirmed!,
                namaConfirmed: item.idPermintaanUsersConfirmedFK?.nama,
                timeConfirmed: item.timeConfirmed?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                used: item.used,
                reason: item.reason,
                status: item.status
            })
        })


        const count = await prisma.permintaan.count({
            where: {
                idBagianCreated: data.idBagian ?? undefined,
                AND: [
                    {
                        OR: [
                            {
                                idPermintaanUsersCreatedFK: {
                                    nama: {
                                        contains: data.keyword ?? ""
                                    }
                                }
                            },
                            {
                                idPermintaanUsersCreatedFK: {
                                    nik: {
                                        contains: data.keyword ?? ""
                                    }
                                }
                            }
                        ]
                    },
                    {
                        status: data.status == null ? undefined : data.status
                    },
                    {
                        used: data.used ?? undefined
                    }
                ]
            },
        })

        return { data: result, count: count }
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
                jumlah: true
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
export async function get_rb_return_by_product(id: number, status: string | null, limit: number | null, offset: number | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
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
		        ( YEAR ( r.timeCreated ) = ${startDate.split("-")[1]} AND MONTH ( r.timeCreated ) >= ${startDate.split("-")[0]} ) 
		        AND ( YEAR ( r.timeCreated ) = ${endDate.split("-")[1]} AND MONTH ( r.timeCreated ) <= ${endDate.split("-")[0]} ) 
	            )` : ""}
            GROUP BY
                d.idPermintaanMbr
            ${status == "belum" ? `HAVING COUNT(CASE WHEN n.status = 'ACTIVE' THEN 1 END) > 0` : ""}
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
                tahun: item.tahun,
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
                tahun: item.tahun,
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