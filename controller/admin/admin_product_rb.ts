import { NextFunction, Request, Response } from "express";
import * as adminProductRb from "../../services/admin/admin_product_rb_service";
import { Status } from "@prisma/client";
import * as exceljs from "exceljs"

interface kategori {
    id?: string | number;
    namaKategori?: string;
    startingNumber?: string;
}

interface produk {
    id?: string | number;
    namaProduk?: string;
    idBagian?: string;
    idKategori?: string;
}


//ANCHOR - Tambah Kategori
export async function add_category(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: kategori = {
            namaKategori: req.body.nama_kategori ?? "",
            startingNumber: req.body.starting_number ?? ""
        }

        if (postData.startingNumber?.match(/\d{6}/) == null) {
            throw new Error("Starting Number Harus 6 digit")
        }

        const category = await adminProductRb.add_category(postData)

        if ('data' in category!) {
            res.status(200).json({
                data: category.data,
                message: "Tambah Kategori Berhasil",
                status: "success"
            });
        } else {
            throw category
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Konfirmasi RB
export async function confirm_request(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { id: string, action: string, timeConfirmed: string, idConfirmed: string, reason: string } = {
            id: req.params.id,
            action: req.body.action,
            timeConfirmed: new Date().toISOString(),
            idConfirmed: res.locals.userinfo.id,
            reason: req.body.reason ?? ""
        }

        if (postData.action == "confirm") {
            const confirmPermintaan = await adminProductRb.accept_permintaan(postData)

            if ('data' in confirmPermintaan!) {
                return res.status(200).json({
                    data: confirmPermintaan.data,
                    message: "Confirm Permintaan Berhasil",
                    status: "success"
                });
            } else {
                throw confirmPermintaan
            }
        }

        if (postData.action == "reject") {
            const confirmPermintaan = await adminProductRb.reject_permintaan(postData)

            if ('data' in confirmPermintaan!) {
                return res.status(200).json({
                    data: confirmPermintaan.data,
                    message: "Reject Permintaan Berhasil",
                    status: "success"
                });
            } else {
                throw confirmPermintaan
            }
        }

        return res.status(204).json({
            message: "No Content",
            status: "success"
        });

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - menampilkan semua data rekap permintaan semua bagian
export async function get_recap_request(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { tahun: string | undefined } = {
            tahun: req.query.tahun?.toString()
        }

        const tahun: number = postData.tahun !== undefined ? parseInt(postData.tahun) : new Date().getFullYear()
        const idBagian: number | undefined = res.locals.userinfo.isAdmin == true ? undefined : res.locals.userinfo.bagian_jabatan[0].id_bagian

        const data: { tahun: number, idBagian: number | undefined } = {
            tahun: tahun,
            idBagian: idBagian
        }

        const getRecap: any = await adminProductRb.get_recap_permintaan(data)

        if ('data' in getRecap!) {
            return res.status(200).json({
                data: getRecap.data,
                count: getRecap.count,
                status: "success"
            });
        } else {
            throw getRecap
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - menampilkan semua data permintaan berdasarkan status PENDING | DITERIMA | DITOLAK | ALL
export async function get_request_lists(req: Request, res: Response, next: NextFunction) {
    try {
        const { status } = req.query

        let postData: { status: string | null } = {
            status: status === undefined ? null : status.toString().toUpperCase()
        }

        const statusEnum = postData.status !== null ? ["PENDING", "DITERIMA", "DITOLAK"].includes(postData.status!.toString()) && postData.status!.toString() : null

        const data: { status: string | null } = {
            status: statusEnum == false ? null : statusEnum
        }

        const listPending: any = await adminProductRb.get_permintaan(data)

        if ('data' in listPending!) {
            return res.status(200).json({
                data: listPending.data,
                count: listPending.count,
                status: "success"
            });
        } else {
            throw listPending
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Mencari daftar produk sesuai bagian
export async function get_request_by_department(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { idBagian: string | undefined, tahun: string | undefined } = {
            idBagian: req.query.id_bagian?.toString(),
            tahun: req.query.tahun?.toString()
        }

        const data: { idBagian: number, tahun: number } = {
            idBagian: parseInt(postData.idBagian!),
            tahun: parseInt(postData.tahun!)
        }

        const listsByBagian: any = await adminProductRb.get_permintaan_bagian(data)

        if ('data' in listsByBagian!) {
            return res.status(200).json({
                data: listsByBagian.data,
                count: listsByBagian.count,
                status: "success"
            });
        } else {
            throw listsByBagian
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Mencari daftar permintaan sesuai produk
export async function get_request_by_produk(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { idProduk: string | undefined, tahun: string | undefined, month: string | undefined } = {
            idProduk: req.query.id_produk?.toString(),
            tahun: req.query.tahun?.toString(),
            month: req.query.bulan?.toString() == "" ? undefined : req.query.bulan?.toString()
        }

        const data: { idProduk: number, tahun: number, month: number | undefined } = {
            idProduk: parseInt(postData.idProduk!),
            tahun: parseInt(postData.tahun!),
            month: postData.month != undefined ? parseInt(postData.month) : undefined
        }

        const listsByProduk: any = await adminProductRb.get_permintaan_produk(data)

        if ('data' in listsByProduk!) {
            return res.status(200).json({
                data: listsByProduk.data,
                count: listsByProduk.count,
                status: "success"
            });
        } else {
            throw listsByProduk
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Menampilkan semua nomor urut berdasarkan idPermintaan
export async function get_nomor_by_id(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { idPermintaan: string | undefined, idProduk: string | undefined } = {
            idPermintaan: req.query.id?.toString(),
            idProduk: req.query.id_produk?.toString()
        }

        const data: { idPermintaan: number, idProduk: number } = {
            idPermintaan: parseInt(postData.idPermintaan!),
            idProduk: parseInt(postData.idProduk!)
        }

        const listsByProduk: any = await adminProductRb.get_nomor_by_id(data)

        if ('data' in listsByProduk!) {
            return res.status(200).json({
                data: listsByProduk.data,
                count: listsByProduk.count,
                status: "success"
            });
        } else {
            throw listsByProduk
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Menampilkan semua nomor urut berdasarkan idPermintaan
export async function get_nomor_request_by_id(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { idPermintaan: string | undefined } = {
            idPermintaan: req.query.id?.toString()
        }

        const data: { idPermintaan: number } = {
            idPermintaan: parseInt(postData.idPermintaan!)
        }

        const listsByIdPermintaan: any = await adminProductRb.get_nomor_permintaan_by_id(data)

        if ('data' in listsByIdPermintaan!) {
            return res.status(200).json({
                data: listsByIdPermintaan.data,
                status: "success"
            });
        } else {
            throw listsByIdPermintaan
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Menampilkan daftar permintaan berdasarkan idPermintaan
export async function get_request_by_id(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: { idPermintaan: string | undefined } = {
            idPermintaan: req.query.id?.toString()
        }

        const data: { idPermintaan: number } = {
            idPermintaan: parseInt(postData.idPermintaan!)
        }

        const listsByProduk: any = await adminProductRb.get_permintaan_by_id(data)

        if ('data' in listsByProduk!) {
            return res.status(200).json({
                data: listsByProduk.data,
                count: listsByProduk.count,
                status: "success"
            });
        } else {
            throw listsByProduk
        }

    } catch (error) {
        return next(error)
    }
}


// Pengembalian RB
//ANCHOR - Get RB Return By Product
export async function get_rb_return_by_product(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const status = req.query.status == undefined ? null : String(req.query.status)
        const limit = req.query.limit == undefined ? null : Number(req.query.limit)
        const offset = req.query.offset == undefined ? null : Number(req.query.offset)
        const startDate = req.query.startDate == undefined ? null : String(req.query.startDate)
        const endDate = req.query.endDate == undefined ? null : String(req.query.endDate)

        const request = await adminProductRb.get_rb_return_by_product(Number(id), status, limit, offset, startDate, endDate)

        if ('data' in request! && 'count' in request!) {
            //console.log(request.data)
            return res.status(200).json({
                data: request.data,
                count: Number(request.count),
                message: "Detail Permintaan RB",
                status: "success",
                limit: limit,
                offset: offset
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Get RB Return By Product and Permintaan
export async function get_rb_return_by_product_and_permintaan(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const idPermintaan = req.params.idPermintaan
        const status = req.query.status == undefined ? null : String(req.query.status)

        const request = await adminProductRb.get_rb_return_by_product_and_permintaan(Number(id), Number(idPermintaan), status)

        if ('data' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Detail Permintaan RB",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Get RB Return By ID Permintaan
export async function get_rb_return_by_id_permintaan(req: Request, res: Response, next: NextFunction) {
    try {
        const idPermintaan = req.params.idPermintaan
        const limit = req.query.limit == undefined ? null : Number(req.query.limit)
        const offset = req.query.offset == undefined ? null : Number(req.query.offset)

        const request = await adminProductRb.get_rb_return_by_id_permintaan(Number(idPermintaan), limit, offset)

        if ('data' in request! && 'count' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Detail Permintaan RB",
                count: request.count,
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Update Nomor RB Return
export async function set_nomor_rb_return(req: Request, res: Response, next: NextFunction) {
    try {
        const idNomor = req.params.idNomor
        const { status, nomor_batch, tanggal_kembali }: { status: Status | undefined, nomor_batch: string | null | undefined, tanggal_kembali: string | null | undefined } = req.body

        const data = {
            status: status == undefined ? undefined : Status[status],
            nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch,
            tanggal_kembali: tanggal_kembali == undefined ? undefined : tanggal_kembali == "" ? null : tanggal_kembali
        }

        const request = await adminProductRb.set_nomor_rb_return(Number(idNomor), data)

        if ('data' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Nomor RB Return Telah Diupdate",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next
    }
}

//ANCHOR - Confirm RB Return
export async function confirm_rb_return(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const idAdmin = res.locals.userinfo.id
        //console.log(idAdmin)

        const request = await adminProductRb.confirm_rb_return(Number(id), idAdmin)

        if ('data' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Konfirmasi RB Return Berhasil",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Laporan RB Belum Kembali Perbagian
export async function generate_report_rb_belum_kembali_perbagian(req: Request, res: Response, next: NextFunction) {
    try {
        const idBagian = req.query.idBagian == undefined ? null : Number(req.query.idBagian)
        const startDate = req.query.startDate == undefined ? null : String(req.query.startDate)
        const endDate = req.query.endDate == undefined ? null : String(req.query.endDate)
        const statusReq = req.query.statusKembali == undefined ? null : String(req.query.statusKembali)

        let status: Status | null = null

        if (statusReq !== null && statusReq == "belum"){
            status = Status.ACTIVE
        }


        const request = await adminProductRb.get_laporan_rb_belum_kembali_perbagian(idBagian, status, startDate, endDate)

        if ('data' in request!) {
            if (request.data == null) {
                return res.status(200).json({
                    message: "RB Sudah Kembali Semua",
                    status: "success"
                });
            }

            if (typeof request.data == "string") {
                return res.status(400).json({
                    message: request.data,
                    status: "failed"
                });
            }

            const fileName = `Laporan RB Belum Kembali ${request.data[0].namaBagian}-${new Date().toISOString().replace(/[:T-]/g, '').slice(0, 14)}.xlsx`;

            const workbook = new exceljs.Workbook();

            const sheet = workbook.addWorksheet("Laporan RB Belum Kembali Perbagian");


            for (let row = 0; row < 4; row++) {
                if (row == 2) {
                    sheet.addRow(["Laporan RB Belum Kembali Bagian " + request.data[0].namaBagian])
                    sheet.mergeCells("A3:J3");
                    const titleRow = sheet.getRow(3);
                    const firstCellTitleRow = titleRow.getCell(1);
                    firstCellTitleRow.font = { bold: true, name: "Helvetica", size: 16 };
                    firstCellTitleRow.alignment = { vertical: "middle", horizontal: "center" };
                } else {
                    sheet.addRow([]);
                }
            }


            sheet.addRow([
                "No",
                "Tanggal Permintaan",
                "Bagian Produksi",
                "Nama Produk",
                "Kategori",
                "No Dokumen MBR",
                "Tipe MBR",
                "No Urut",
                "Status",
                "No Batch"
            ]);

            const headerRow = sheet.getRow(5);
            headerRow.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.font = { bold: true, name: "Helvetica", size: 11 };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });


            sheet.columns = [
                { key: "id", width: 5 },
                { key: "timeCreated", width: 20 },
                { key: "namaBagian", width: 20 },
                { key: "namaProduk", width: 20 },
                { key: "namaKategori", width: 20 },
                { key: "nomormbr", width: 20 },
                { key: "tipeMBR", width: 20 },
                { key: "nomorUrut", width: 20 },
                { key: "status", width: 20 },
                { key: "nomorBatch", width: 20 },
            ];

            sheet.getColumn("id").alignment = { vertical: "middle", horizontal: "center" };


            let i = 1;

            request.data.forEach((item) => {
                const statusCapitalized = item.status.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                const row = sheet.addRow({
                    id: i,
                    timeCreated: new Date(item.timeCreated).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
                    namaBagian: item.namaBagian,
                    namaProduk: item.namaProduk,
                    namaKategori: item.namaKategori,
                    nomormbr: item.nomormbr,
                    tipeMBR: item.tipeMBR,
                    nomorUrut: item.nomorUrut,
                    nomorBatch: item.nomorBatch ?? "",
                    status: item.status === "ACTIVE" ? "Belum Kembali" : statusCapitalized,
                });

                row.eachCell((cell) => {
                    cell.font = { name: "Helvetica", size: 11 };
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });

                i++;
            });
            
            res.header('Access-Control-Expose-Headers', 'Content-Disposition');

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileName}"`
            );

            await workbook.xlsx.write(res);
            return res.end();

        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}