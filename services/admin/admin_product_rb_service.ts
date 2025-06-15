import { Konfirmasi, Prisma, PrismaClient, Status, TipeMBR } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";


//SECTION - Product Model Admin
const prisma = new PrismaClient();

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

interface ReturnRBQuery {
    id: string,
    nomorMBR?: string,
    idProduk?: string,
    tipeMBR?: TipeMBR,
    namaProduk: string,
    tanggal?: number,
    bulan?: number,
    tahun?: number | string,
    nomorAwal: number | string,
    nomorAkhir: number | string,
    RBBelumKembali: string
    JumlahOutstanding?: string
}

interface ReturnRBResult extends ReturnRBQuery {
    tanggalBulan: string;
}

interface kategori {
    id?: string | number;
    namaKategori?: string;
    startingNumber?: string;
}

interface GroupedPermintaan {
    idProduk: number;
    namaProduk: string | null;
    items: {
        id: number;
        group_id: number;
        nomorMBR: string;
        jumlah: number;
        tipeMBR: string;
        nomorAwal?: string;
        nomorAkhir?: string;
    }[];
}

interface produk {
    id?: string | number;
    namaProduk?: string;
    idBagian?: string;
    idKategori?: string;
}

export interface Permintaan {
    id?: number;
    idCreated?: number;
    timeCreated?: string;
    idConfirmed?: number;
    nameConfirmed?: string;
    emailCreated?: string;
    emailConfirmed?: string;
    timeConfirmed?: string;
    status?: Konfirmasi;
}

interface NomorMBRList {
    id?: number;
    idDetailPermintaan: number;
    nomorUrut: string;
    status?: Status;
    tanggalKembali?: string;
    idUserTerima?: number;
    nomorBatch?: string;
    tahun: number;
}

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

interface ModifiedPermintaan {
    id?: number | string;
    createdBy?: string;
    createdByBagian?: string;
    createdAt?: string;
    confirmedBy?: string | null;
    confirmedAt?: string | null;
    status?: string;
    createdNIK?: string;
    reason?: string | null;
}

interface RecapPermintaan {
    id: number;
    namaBagian: string;
    RBBelumKembali: number;
    RBSudahKembali: number;
    tahun: number;
}

interface ProdukByBagian {
    id: number;
    namaProduk: string;
    RBBelumKembali: number;
    RBSudahKembali: number;
    tahun: number;
}

interface PermintaanByProduk {
    idPermintaan: number;
    nama: string;
    nik: string;
    timeCreated: Date | string;
    nomorMBR: string;
    namaProduk: string;
    nomorAwal: string;
    nomorAkhir: string;
    RBBelumKembali: number;
    RBSudahKembali: number;
    tahun: number;
}

interface NomorByIdPermintaan {
    id: number;
    nomorMBR: string;
    namaProduk: string;
    nomorUrut: string;
    nomorAwal?: string;
    nomorAkhir?: string;
    status: Status;
    nomorBatch: string;
    tanggalKembali: Date | string;
    nama: string;
}

interface NomorPermintaanById {
    idProduk: number;
    namaProduk: string;
    nomorMBR: string;
    tipeMBR: string;
    jumlah: number;
    nomorAwal: string;
    nomorAkhir: string;
    group_id: number;
}

export interface ILaporanPembuatanRB {
    namaJenisBagian: string;
    data: { total: number; late: number; month: number }[]
}

//ANCHOR - Tambah Kategori
export async function add_category(data: kategori): Promise<ResultModel<kategori | null> | { data: string }> {
    try {
        const addCategory = await prisma.kategori.create({
            data: {
                namaKategori: data.namaKategori ?? "",
                startingNumber: data.startingNumber ?? ""
            },
            select: {
                id: true,
                namaKategori: true,
                startingNumber: true
            }
        })

        return { data: addCategory }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Check Kategori
export async function check_category(data: { namaKategori: string }): Promise<ResultModel<number | null>> {
    try {
        const checkCategory = await prisma.kategori.count({
            where: {
                namaKategori: data.namaKategori
            }
        })

        return { data: checkCategory }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Update Kategori
export async function update_kategori(id: number, putData: { namaKategori: string, startingNumber: string }): Promise<ResultModel<kategori | null> | { data: string }> {
    try {
        const updateCategory = await prisma.kategori.update({
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
        })

        return { data: updateCategory }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Delete Kategori
export async function delete_kategori(id: number): Promise<ResultModel<kategori | null> | { data: string }> {
    try {
        const deleteCategory = await prisma.kategori.delete({
            where: {
                id: id
            }
        })

        return { data: deleteCategory }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Update Permintaan RB
export async function accept_permintaan(data: { id: string, action: string, timeConfirmed: string, idConfirmed: string }): Promise<ResultModel<Permintaan | null>> {
    try {
        const resultAcceptPermintaan = await prisma.$transaction(async (tx) => {
            const checkPermintaan = await tx.permintaan.findFirst({
                where: {
                    id: parseInt(data.id)
                },
                select: {
                    status: true
                }
            })

            if (checkPermintaan?.status != "PENDING") {
                throw new Error("Transaksi sudah dikonfirmasi")
            }

            const acceptPermintaan = await tx.permintaan.update({
                where: {
                    id: parseInt(data.id)
                },
                data: {
                    idConfirmed: parseInt(data.idConfirmed),
                    timeConfirmed: data.timeConfirmed,
                    status: Konfirmasi["DITERIMA"]
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
            })

            const result: Permintaan = {
                id: Number(acceptPermintaan.id),
                timeConfirmed: acceptPermintaan.timeConfirmed?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                status: acceptPermintaan.status,
                emailCreated: acceptPermintaan.idPermintaanUsersCreatedFK?.email,
                emailConfirmed: acceptPermintaan.idPermintaanUsersConfirmedFK?.email,
                nameConfirmed: acceptPermintaan.idPermintaanUsersConfirmedFK?.nama
            }

            const findRB = await tx.detailpermintaanmbr.findMany({
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
            })

            //console.log(findRB)

            for (const detail of findRB) {
                const data: NomorMBRList[] = Array()
                const year = new Date().getFullYear()

                const checkNomor = await tx.nomormbr.findFirst({
                    where: {
                        idDetailPermintaan: detail.id
                    },
                    select: {
                        id: true
                    }
                })


                if (checkNomor !== null) {
                    //console.log(checkNomor)
                    throw new Error("Nomor MBR sudah ada")
                }

                const findNomor = await tx.nomormbr.aggregate({
                    where: {
                        AND: [{
                            idDetailPermintaanFk: {
                                idProdukFK: {
                                    idKategori: detail.idProdukFK?.idKategori
                                }
                            }
                        }, {
                            tahun: year
                        }, {
                            idDetailPermintaanFk: {
                                idProdukFK: {
                                    idBagianFK: {
                                        idJenisBagian: detail.idProdukFK?.idBagianFK?.idJenisBagian
                                    }
                                }
                            }
                        }]
                    },
                    _max: {
                        nomorUrut: true
                    }
                })

                if (findNomor._max.nomorUrut != null) {
                    for (let i = 0; i < detail.jumlah; i++) {
                        data.push({
                            idDetailPermintaan: Number(detail.id),
                            nomorUrut: (parseInt(findNomor._max.nomorUrut) + (i + 1)).toString().padStart(6, "0"),
                            status: Status["ACTIVE"],
                            tahun: year,
                        })
                    }
                } else {
                    for (let i = 0; i < detail.jumlah; i++) {
                        data.push({
                            idDetailPermintaan: Number(detail.id),
                            nomorUrut: (parseInt(detail.idProdukFK?.idKategoriFK.startingNumber!) + (i + 1)).toString().padStart(6, "0"),
                            status: Status["ACTIVE"],
                            tahun: year,
                        })
                    }
                }

                //console.log(data)

                const addNomorRB = await tx.nomormbr.createMany({
                    data: data
                })
            }

            return result

        }, {
            timeout: 60000
        })

        return { data: resultAcceptPermintaan }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Update Permintaan RB
export async function reject_permintaan(data: { id: string, action: string, timeConfirmed: string, idConfirmed: string, reason: string }): Promise<ResultModel<Permintaan | null>> {
    try {
        const checkPermintaan = await prisma.permintaan.findFirst({
            where: {
                id: parseInt(data.id)
            },
            select: {
                status: true
            }
        })

        if (checkPermintaan?.status != "PENDING") {
            throw new Error("Transaksi sudah dikonfirmasi")
        }

        const updatePermintaan = await prisma.permintaan.update({
            where: {
                id: parseInt(data.id)
            },
            data: {
                idConfirmed: parseInt(data.idConfirmed),
                timeConfirmed: data.timeConfirmed,
                status: Konfirmasi["DITOLAK"],
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
        })

        const result: Permintaan = {
            id: Number(updatePermintaan.id),
            timeConfirmed: updatePermintaan.timeConfirmed?.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
            status: updatePermintaan.status,
            emailCreated: updatePermintaan.idPermintaanUsersCreatedFK?.email,
            emailConfirmed: updatePermintaan.idPermintaanUsersConfirmedFK?.email,
            nameConfirmed: updatePermintaan.idPermintaanUsersConfirmedFK?.nama
        }

        return { data: result }

    } catch (error) {
        throw error
    }
}

// keyword: req.query.keyword == undefined ? null : String(req.query.keyword),
// idBagian: req.query.idBagian == undefined ? null : Number(req.query.idBagian),
// idProduk: req.query.idProduk == undefined ? null : Number(req.query.idProduk),
// status: req.query.status == undefined ? null : checkStatus(String(req.query.status)),
// used: req.query.used == undefined ? null : checkUsed(String(req.query.used)),
// limit: req.query.limit == undefined ? null : Number(req.query.limit),
// offset: req.query.offset == undefined ? null : Number(req.query.offset),

//ANCHOR - Mengambil semua permintaan sesuai status
export async function get_permintaan(data: { keyword: null | string, idBagian: number | null, idProduk: number | null, status: Konfirmasi | null, used: boolean | null, year: number | null, limit: number | null, offset: number | null }): Promise<ResultModel<ModifiedPermintaan[] | null> | { data: string }> {
    try {

        const year = new Date().getFullYear()

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
            AND EXTRACT(YEAR FROM r."timeCreated") = ${data.year ?? year}
        GROUP BY 
            ucr."nama", uc."nama", ucr."nik", r."id", r."idCreated", r."timeCreated", r."idBagianCreated", b."namaBagian", 
            r."idConfirmed", r."timeConfirmed", r."status", r."reason", r."used"
        ORDER BY 
            r."timeCreated" DESC 
        ${data.limit ? `LIMIT ${data.limit}` : ''} 
        ${data.offset ? `OFFSET ${data.offset}` : ''}`
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

        const getRequest = await prisma.$queryRaw<RequestRB[]>(Prisma.sql([query]))

        const result: ModifiedPermintaan[] = Array()

        getRequest.forEach((request) => {
            result.push({
                id: Number(request.id!),
                createdBy: request.namaCreated,
                createdByBagian: request.namaBagianCreated,
                createdAt: request.timeCreated!.toLocaleString("id-ID"),
                confirmedBy: request.namaConfirmed || null,
                confirmedAt: request.timeConfirmed?.toLocaleString("id-ID") || null,
                status: request.status,
                createdNIK: request.nikCreated,
                reason: request.reason
            })
        })

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
                AND EXTRACT(YEAR FROM r."timeCreated") = ${data.year ?? year}
            GROUP BY
                r."id"
        ) AS subquery;`

        const count = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([queryCount]))

        return { data: result, count: Number(count[0].count) }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Mengambil semua rekap permintaan sesuai tahun
export async function get_recap_permintaan(data: { tahun: number, idBagian: number | undefined }): Promise<ResultModel<RecapPermintaan[] | null> | { data: string }> {
    try {
        let query = `n."tahun" = ${data.tahun}`

        if (data.idBagian !== undefined) {
            query += ` AND b."id" = ${data.idBagian}`
        }

        const recap = await prisma.$queryRaw<RecapPermintaan[]>`SELECT
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
            ${Prisma.sql`(${Prisma.raw(query)})`}
        GROUP BY
            b."id",
            b."namaBagian",
            n."tahun"`

        const result: RecapPermintaan[] = recap.map((request) => ({
            id: Number(request.id),
            namaBagian: request.namaBagian,
            RBBelumKembali: Number(request.RBBelumKembali),
            RBSudahKembali: Number(request.RBSudahKembali),
            tahun: Number(request.tahun)
        }))

        const count = result.length

        return { data: result, count: count }

    } catch (error) {
        throw error
    }
}


//ANCHOR - Mengambil semua permintaan sesuai produksi
export async function get_permintaan_bagian(data: { idBagian: number, tahun: number }): Promise<ResultModel<ProdukByBagian[] | null> | { data: string }> {
    try {
        const searchRequest = await prisma.$queryRaw<ProdukByBagian[]>`SELECT
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
            n."tahun"`

        const result: ProdukByBagian[] = searchRequest.map((request) => ({
            id: Number(request.id),
            namaProduk: request.namaProduk,
            RBBelumKembali: Number(request.RBBelumKembali),
            RBSudahKembali: Number(request.RBSudahKembali),
            tahun: request.tahun
        }))

        const count = result.length

        return { data: result, count: count }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Mengambil semua permintaan sesuai produk
export async function get_permintaan_produk(data: { idProduk: number, tahun: number, month: number | undefined }): Promise<ResultModel<PermintaanByProduk[] | null> | { data: string }> {
    try {
        let query: string = `d.idProduk = ${data.idProduk} AND n.tahun = ${data.tahun}`

        if (data.month !== undefined) {
            query += ` AND MONTH(r.timeCreated) = ${data.month}`
        }

        const searchRequest = await prisma.$queryRaw<PermintaanByProduk[]>`
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
            ${Prisma.raw(query)}
        GROUP BY
            u."nama",
            u."nik",
            r."timeCreated",
            p."namaProduk",
            n."tahun"
        ORDER BY
            r."timeCreated" ASC`

        const result: PermintaanByProduk[] = searchRequest.map((request) => ({
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
        }))

        const count = result.length

        return { data: result, count: count }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Mengambil semua nomor sesuai idPermintaan
export async function get_nomor_by_id(data: { idPermintaan: number, idProduk: number }): Promise<ResultModel<NomorByIdPermintaan[] | null> | { data: string }> {
    try {
        const searchRequest = await prisma.$queryRaw<NomorByIdPermintaan[]>`
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
            n."nomorUrut" ASC`

        const result: NomorByIdPermintaan[] = searchRequest.map((request) => ({
            id: Number(request.id),
            nomorMBR: request.nomorMBR,
            namaProduk: request.namaProduk,
            nomorUrut: request.nomorUrut,
            status: request.status,
            nomorBatch: request.nomorBatch,
            tanggalKembali: request.tanggalKembali?.toLocaleString("id-ID"),
            nama: request.nama,
        }))

        const count = result.length

        return { data: result, count: count }

    } catch (error) {
        throw error
    }
}

//ANCHOR - Mengambil semua permintaan berdasarkan idPermintaan
export async function get_permintaan_by_id(data: { idPermintaan: number }): Promise<ResultModel<GroupedPermintaan[] | null> | { data: string }> {
    try {
        const searchRequest = await prisma.detailpermintaanmbr.findMany({
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
        })

        const result = searchRequest.reduce<GroupedPermintaan[]>((acc, produk) => {
            const checkExist = acc.find(item => item.idProduk === produk.idProduk && item.items[0].group_id === produk.group_id)

            if (checkExist) {
                checkExist.items.push({
                    group_id: produk.group_id,
                    id: Number(produk.id),
                    nomorMBR: produk.nomorMBR,
                    jumlah: produk.jumlah,
                    tipeMBR: produk.tipeMBR
                })
            } else {
                acc.push({
                    idProduk: produk.idProduk,
                    namaProduk: produk.idProdukFK!.namaProduk,
                    items: [{
                        group_id: produk.group_id,
                        id: Number(produk.id),
                        nomorMBR: produk.nomorMBR,
                        jumlah: produk.jumlah,
                        tipeMBR: produk.tipeMBR
                    }]
                })
            }

            return acc
        }, [])



        return { data: result }

    } catch (error) {
        throw error
    }
}

//ANCHOR - List Nomor Awal Akhir by Permintaan
export async function get_nomor_permintaan_by_id(data: { idPermintaan: number }): Promise<ResultModel<GroupedPermintaan[] | null> | { data: string }> {

    try {
        const searchRequest = await prisma.$queryRaw<NomorPermintaanById[]>`
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
            d."id", d."idProduk", d."nomorMBR", d."tipeMBR", d."jumlah", d."group_id", p."namaProduk";`

        const result = searchRequest.reduce<GroupedPermintaan[]>((acc, produk) => {
            const checkExist = acc.find(item => Number(item.idProduk) === Number(produk.idProduk) && Number(item.items[0].group_id) === Number(produk.group_id))

            if (checkExist) {
                checkExist.items.push({
                    group_id: Number(produk.group_id),
                    id: Number(produk.idProduk),
                    nomorMBR: produk.nomorMBR,
                    jumlah: Number(produk.jumlah),
                    tipeMBR: produk.tipeMBR,
                    nomorAwal: produk.nomorAwal,
                    nomorAkhir: produk.nomorAkhir
                })
            } else {
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
                })
            }

            return acc
        }, [])



        return { data: result }

    } catch (error) {
        throw error
    }
}


//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
export async function get_rb_return_by_product(id: number, status: string | null, numberFind: string | null, limit: number | null, offset: number | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
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
        ${limit != null && offset != null ? `LIMIT ${limit} OFFSET ${offset}` : ""}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

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
        ) AS subquery;`

        const getCount = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([countQuery]))


        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            let data: ReturnRBResult = {
                id: String(item.id),
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan}`,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali),
            }

            if (status === "outstanding") {
                data = {
                    ...data,
                    JumlahOutstanding: String(item.JumlahOutstanding)
                }
            }

            result.push(data)
        })

        //console.log(getCount[0].count.toString())

        return { data: result, count: getCount[0].count }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Get Permintaan RB Return Berdasarkan Bagian
export async function get_rb_return_by_bagian(id: number, status: string | null, numberFind: string | null, limit: number | null, offset: number | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
    console.log(status)
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
            ${(status === "outstanding") ? ` AND COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0` : ""}
        ${limit != null && offset != null ? ` LIMIT ${limit} OFFSET ${offset}` : ''}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

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
        ) AS subquery;`

        const getCount = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([countQuery]))


        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            let data: ReturnRBResult = {
                id: String(item.id),
                idProduk: String(item.idProduk),
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali),
            }

            if (status === "outstanding") {
                data = {
                    ...data,
                    JumlahOutstanding: String(item.JumlahOutstanding)
                }
            }

            result.push(data)
        })

        //console.log(getCount[0].count.toString())

        return { data: result, count: getCount[0].count }
    } catch (error) {
        console.log(error)
        throw error
    }
}

//ANCHOR - Get Permintaan RB Return Berdasarkan Produk
export async function get_rb_return_by_status_outstanding(numberFind: string | null, limit: number | null, offset: number | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ReturnRBResult[] | null> | { data: string }> {
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
        ${(limit != null && offset != null) ? `LIMIT ${limit} OFFSET ${offset}` : ""}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

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
            ) as subquery;`

        const getCount = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql([countQuery]))


        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            let data: ReturnRBResult = {
                id: String(item.id),
                idProduk: String(item.idProduk),
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali),
                JumlahOutstanding: String(item.JumlahOutstanding)
            }

            result.push(data)
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
            ${(status === "outstanding") ? `AND COUNT(CASE WHEN (n."status" = 'KEMBALI' OR n."status" = 'BATAL') AND n."idUserTerima" IS NULL THEN 1 END) > 0` : ``}`

        const getRequest = await prisma.$queryRaw<ReturnRBQuery[]>(Prisma.sql([query]))

        if (getRequest == null) {
            return { data: "Data Permintaan tidak ditemukan" }
        }

        const result: ReturnRBResult[] = Array()

        getRequest.map(item => {
            let data: ReturnRBResult = {
                id: String(item.id),
                tipeMBR: item.tipeMBR,
                nomorMBR: item.nomorMBR,
                namaProduk: item.namaProduk,
                tanggalBulan: `${item.tanggal}-${item.bulan} `,
                tahun: String(item.tahun),
                nomorAwal: item.nomorAwal,
                nomorAkhir: item.nomorAkhir,
                RBBelumKembali: String(item.RBBelumKembali)
            }

            if (status === "outstanding" || status === "all") {
                data = {
                    ...data,
                    JumlahOutstanding: String(item.JumlahOutstanding)
                }
            }

            result.push(data)
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
                id: Number(item.id),
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

//ANCHOR - Confirm Nomor RB Return
export async function confirm_rb_return(id: number, idAdmin: number): Promise<ResultModel<boolean> | { data: string }> {
    try {
        const updateRequest = await prisma.nomormbr.update({
            where: {
                id: id
            },
            data: {
                idUserTerima: idAdmin
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

export interface ILaporanRB {
    nomorUrut: string;
    namaProduk: string;
    timeConfirmed: string;
    tipeMBR: string;
    namaBagian: string;
    status: Status;
    nomorBatch: string | null;
    tanggalKembali: string | null;
}

// ANCHOR - Laporan RB Belum Kembali perbagian
export async function get_laporan_rb_belum_kembali_perbagian(idBagian: number | null, status: Status | null, startDate: string | null, endDate: string | null): Promise<ResultModel<ILaporanRB[] | null> | { data: string }> {
    try {
        const year = new Date().getFullYear()
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
            b."namaBagian", k."namaKategori", p."namaProduk", n."nomorUrut", r."timeCreated" ASC;`

        const getRequest = await prisma.$queryRaw<ILaporanRB[]>(Prisma.sql([query]))

        if (getRequest.length == 0) {
            return { data: null }
        }

        return { data: getRequest }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Generate Report Dashboard Admin
export async function generate_report_dashboard_admin(): Promise<ResultModel<{ RBBelumKembali: { count: number | string, namaBagian: string }[], RBDibuat: { count: number | string, namaJenisBagian: string }[] } | null | { data: string }>> {
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
                b."namaBagian";`

        const getRequest = await prisma.$queryRaw<{ count: number, namaBagian: string }[]>(Prisma.sql([query]))

        const result = getRequest.map(item => ({
            count: String(item.count),
            namaBagian: item.namaBagian
        }))

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
                j."namaJenisBagian";`

        const getRequestRBDibuat = await prisma.$queryRaw<{ count: number, namaJenisBagian: string }[]>(Prisma.sql([queryRBDibuat]))
        const resultRBDibuat = new Array()

        getRequestRBDibuat.map(item => {
            resultRBDibuat.push({
                count: String(item.count),
                namaJenisBagian: item.namaJenisBagian
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

//ANCHOR - Generate Report Dashboard Admin
export async function generate_report_pembuatan_rb(tahun: number): Promise<ResultModel<ILaporanPembuatanRB[] | null>> {
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
            EXTRACT(YEAR FROM r."timeCreated");`

        const request = await prisma.$queryRaw<{ namaJenisBagian: string, total: number, late: number, bulan: number, tahun: number }[]>(Prisma.sql([query]))

        if (request.length == 0) {
            return { data: [] }
        }

        const groupedData = request.reduce<ILaporanPembuatanRB[]>((acc, curr) => {
            // Cari apakah sudah ada elemen dengan namaJenisBagian yang sama
            const existingGroup = acc.find(item => item.namaJenisBagian === curr.namaJenisBagian);

            if (existingGroup) {
                // Jika ada, tambahkan data ke array `data`
                existingGroup.data.push({
                    total: Number(curr.total),
                    late: Number(curr.late),
                    month: Number(curr.bulan)
                });
            } else {
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



        return { data: groupedData }

    } catch (error) {
        throw error
    }
}


