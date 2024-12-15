import { NextFunction, Request, Response } from "express";
import * as adminProductRb from "../../services/admin/admin_product_rb_service";
import { Konfirmasi, Status } from "@prisma/client";
import * as exceljs from "exceljs"
import { ILaporanRB } from "../../services/admin/admin_product_rb_service";

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

const months: { id: number, nama: string }[] = [
    { id: 1, nama: 'Januari' },
    { id: 2, nama: 'Februari' },
    { id: 3, nama: 'Maret' },
    { id: 4, nama: 'April' },
    { id: 5, nama: 'Mei' },
    { id: 6, nama: 'Juni' },
    { id: 7, nama: 'Juli' },
    { id: 8, nama: 'Agustus' },
    { id: 9, nama: 'September' },
    { id: 10, nama: 'Oktober' },
    { id: 11, nama: 'November' },
    { id: 12, nama: 'Desember' }
];

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
        function checkStatus(status: string) {

            if (status == "all") {
                return null
            }

            if (status == "onlyConfirmed") {
                return Konfirmasi["DITERIMA"]
            }

            if (status == "onlyPending") {
                return Konfirmasi["PENDING"]
            }

            if (status == "onlyRejected") {
                return Konfirmasi["DITOLAK"]
            }

            return null
        }

        function checkUsed(used: string) {
            if (used == "onlyUsed") {
                return true
            }

            if (used == "onlyAvailable") {
                return false
            }

            return null
        }

        const data = {
            keyword: req.query.keyword == undefined ? null : String(req.query.keyword),
            idBagian: req.query.idBagian == undefined ? null : Number(req.query.idBagian),
            idProduk: req.query.idProduk == undefined ? null : Number(req.query.idProduk),
            status: req.query.status == undefined ? null : checkStatus(String(req.query.status)),
            used: req.query.used == undefined ? null : checkUsed(String(req.query.used)),
            year: req.query.year == undefined ? null : Number(req.query.year),
            limit: req.query.limit == undefined ? null : Number(req.query.limit),
            offset: req.query.offset == undefined ? null : Number(req.query.offset),
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
        const numberFind = req.query.number == undefined ? null : String(req.query.number)

        const request = await adminProductRb.get_rb_return_by_product(Number(id), status, numberFind, limit, offset, startDate, endDate)

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
            nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch.trim(),
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

        const date1input = startDate ?? "01-2024";
        const [month1, year1] = date1input.split("-");
        const date1 = new Date(`${year1}-${month1}-01`);

        const formattedStartDate = new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long" }).format(date1);

        const date2input = endDate ?? "12-2024"; // Format MM-YY
        const [month2, year2] = date2input.split("-");
        const date2 = new Date(`${year2}-${month2}-01`); // Mengonversi ke Date

        const formattedEndDate = new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long" }).format(date2);

        let status: Status | null = null

        if (statusReq !== null && statusReq == "belum") {
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

            const sheet = workbook.addWorksheet("RB Belum Kembali");


            // for (let row = 0; row < 4; row++) {
            //     if (row == 2) {
            //         sheet.addRow(["Data Rekaman Batch Yang Belum Kembali " + request.data[0].namaBagian])
            //         sheet.mergeCells("A3:J3");
            //         const titleRow = sheet.getRow(3);
            //         const firstCellTitleRow = titleRow.getCell(1);
            //         firstCellTitleRow.font = { bold: true, name: "Helvetica", size: 16 };
            //         firstCellTitleRow.alignment = { vertical: "middle", horizontal: "center" };
            //     } else {
            //         sheet.addRow([]);
            //     }
            // }

            for (let row = 0; row < 3; row++) {
                sheet.addRow([]);
            }


            sheet.addRow([
                "No",
                "Nama Produk",
                "Nomor Urut",
                "PO",
                "PS",
                "Tanggal Kirim",
                "Nomor Batch",
                "Tanggal Kembali",
                "Keterangan"
            ]);

            const headerTableRow = sheet.getRow(4);
            headerTableRow.eachCell((cell) => {
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
                { key: "id", width: 7 },
                { key: "namaProduk", width: 32 },
                { key: "nomorUrut", width: 15 },
                { key: "PO", width: 6 },
                { key: "PS", width: 6 },
                { key: "timeConfirmed", width: 19 },
                { key: "nomorBatch", width: 21 },
                { key: "tanggalKembali", width: 19 },
                { key: "keterangan", width: 25 }
            ];

            sheet.getColumn("id").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("namaProduk").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("nomorUrut").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("PO").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("PS").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("timeConfirmed").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("nomorBatch").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("tanggalKembali").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("keterangan").alignment = { vertical: "middle", horizontal: "center" };


            let i = 1;

            (request.data as ILaporanRB[]).forEach((item, index) => {
                //const statusCapitalized = item.status.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                const row = sheet.addRow({
                    id: i,
                    timeConfirmed: new Date(item.timeConfirmed).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "Asia/Jakarta",
                    }),
                    namaProduk: (index == 0 ? item.namaProduk : item.namaProduk == (request.data![index - 1] as ILaporanRB).namaProduk ? "" : item.namaProduk),
                    PO: item.tipeMBR == "PO" ? "V" : "",
                    PS: item.tipeMBR == "PS" ? "V" : "",
                    nomorUrut: item.nomorUrut,
                    nomorBatch: item.nomorBatch ?? "",
                    tanggalKembali: item.tanggalKembali == null ? "" : new Date(item.tanggalKembali).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "Asia/Jakarta"
                    }),
                    keterangan: item.status == "BATAL" ? "Nomor Batal" : ""
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

            sheet.getCell("A1").value = "PT KONIMEX";
            sheet.getCell("A1").font = { bold: true, italic: true, name: "Helvetica", size: 12 };
            sheet.getCell("A1").alignment = { vertical: "middle", horizontal: "left" };
            sheet.getCell("A3").value = `BULAN: ${formattedStartDate} s.d ${formattedEndDate}`;
            sheet.getCell("A3").font = { bold: true, name: "Helvetica", size: 11 };
            sheet.getCell("A3").alignment = { vertical: "middle", horizontal: "left" };
            sheet.getCell("G3").value = `PRODUKSI: ${request.data[0].namaBagian}`;
            sheet.getCell("G3").font = { bold: true, name: "Helvetica", size: 11 };
            sheet.getCell("G3").alignment = { vertical: "middle", horizontal: "left" };
            sheet.mergeCells("A2:F2");
            sheet.getCell("A2").value = `DATA REKAMAN BATCH YANG BELUM KEMBALI`;
            sheet.getCell("A2").font = { bold: true, name: "Helvetica", size: 11 };
            //sheet.getCell("C2").alignment = { vertical: "middle", horizontal: "left" };

            for (let row = 1; row <= 3; row++) {
                for (let col = 1; col <= 9; col++) {
                    const cell = sheet.getCell(row, col);
                    if (row === 1) cell.border = { ...cell.border, top: { style: "thin" } };
                    if (row === 3) cell.border = { ...cell.border, bottom: { style: "thin" }, top: { style: "thin" } };
                    if (col === 1) cell.border = { ...cell.border, left: { style: "thin" } };
                    if (col === 7) cell.border = { ...cell.border, left: { style: "thin" } };
                    if (col === 9) cell.border = { ...cell.border, right: { style: "thin" } };
                }
            }



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

//ANCHOR - Laporan Dashboard Admin
export async function generate_report_dashboard_admin(req: Request, res: Response, next: NextFunction) {
    try {


        const request = await adminProductRb.generate_report_dashboard_admin()

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

//ANCHOR - Laporan Pembuatan RB
export async function generate_report_pembuatan_rb(req: Request, res: Response, next: NextFunction) {
    try {
        const tahun = req.query.tahun == undefined ? null : Number(req.query.tahun);

        if (tahun == null) {
            return res.status(400).json({
                message: "Tahun Harus Diisi",
                status: "failed"
            });
        }

        const request = await adminProductRb.generate_report_pembuatan_rb(tahun);

        if ('data' in request!) {

            const result = months.map((month) => {
                const dataForMonth = [];

                for (const jenisBagian of request.data!) {
                    const entry = jenisBagian.data.find((item) =>
                        Number(item.month) === month.id
                    );

                    dataForMonth.push({
                        namaJenisBagian: jenisBagian.namaJenisBagian,
                        total: entry ? String(entry.total) : "-",
                        late: entry ? String(entry.late) : "-",
                    });
                }

                // Cek apakah Farmasi sudah ada di dataForMonth
                const hasFarmasi = dataForMonth.some(
                    (item) => item.namaJenisBagian === "Farmasi"
                );

                // Jika Farmasi tidak ada, tambahkan data default
                if (!hasFarmasi) {
                    dataForMonth.push({
                        namaJenisBagian: "Farmasi",
                        total: "-",
                        late: "-",
                    });
                }

                // Cek apakah Farmasi sudah ada di dataForMonth
                const hasFood = dataForMonth.some(
                    (item) => item.namaJenisBagian === "Food"
                );

                // Jika Farmasi tidak ada, tambahkan data default
                if (!hasFood) {
                    dataForMonth.push({
                        namaJenisBagian: "Food",
                        total: "-",
                        late: "-",
                    });
                }

                return {
                    waktu: `${month.nama} ${tahun}`,
                    data: dataForMonth,
                };
            });


            return res.status(200).json({
                data: result,
                status: "success",
            });
        } else {
            throw request;
        }
    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
}