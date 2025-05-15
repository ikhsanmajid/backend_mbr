import { NextFunction, Request, Response } from "express";
import * as usersRB from "../../services/users/users_rb_service";
import { Konfirmasi, Status } from "@prisma/client";
import { ILaporanSerahTerimaRB } from "../../services/users/users_rb_service";
import exceljs from "exceljs";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { get_admin_mail, get_dco_mail } from "../../services/admin/admin_users_service";
import { transporter } from "../../helper/mailer";
import { error } from "console";

interface RequestRB {
    id?: number | string;
    oldid?: number;
    idCreated?: number;
    idBagianCreated?: number;
    timeCreated?: string;
    idConfirmed?: number;
    timeConfirmed?: string;
    data?: Array<{
        idProduk: string;
        namaProduk?: string;
        mbr: [{
            group_id: number;
            no_mbr: string;
            tipe_mbr: string;
            jumlah: string;
        }]
    }>
}

//ANCHOR - Tambah Permintaan RB
export async function add_request(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: RequestRB = {
            idCreated: res.locals.userinfo.id,
            idBagianCreated: res.locals.idBagian,
            timeCreated: new Date().toISOString(),
            data: req.body.data
        }

        const request = await usersRB.add_request(postData)

        if ('data' in request!) {
            const toAdminEmail = await get_admin_mail()
            const ccDcoEmail = await get_dco_mail()
            if ('data' in toAdminEmail! && 'data' in ccDcoEmail! && toAdminEmail!.data!.length > 0) {
                let index: number = 1;
                const daftarPermintaan = postData.data?.map((item) => {
                    return item.mbr.map(mbr => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${index++}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${item.namaProduk}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.no_mbr}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.tipe_mbr}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.jumlah}</td>
                        </tr>
                    `).join(""); // Gabungkan hasil dari `map()`
                }).join("");
                const toMailList = toAdminEmail.data!.map(item => item.email).join(', ')
                const ccMailList = ccDcoEmail!.data!.map(item => item.email).join(', ')
                const mailOptions: MailOptions = {
                    sender: process.env.USER_MAIL! as string,
                    to: toMailList,
                    cc: ccMailList,
                    subject: `[No Reply] Konfirmasi Permintaan Nomor MBR - ${request.data?.requestRB.namaBagianCreated} - ${request.data?.requestRB.namaCreated}`,
                    html: `
                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">Dengan Hormat,</p>

                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
                        Mohon dapat melakukan konfirmasi permintaan nomor MBR yang dibuat oleh: 
                        <span style="color: black; font-weight: bold;">${request.data?.requestRB.namaBagianCreated}&#8203; - ${request.data?.requestRB.namaCreated}&#8203;</span>
                    </p>
                    <p>ID transaksi: ${request.data?.requestRB.id}</p>
                    <table style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid black;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">No.</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Nama Produk</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Nomor MBR</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Tipe MBR</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${daftarPermintaan}
                        </tbody>
                    </table>

                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 10px 0 0 0;">Terima kasih.</p>
                    <br/>
                    <br/>
                    <p style="color: gray; font-size: 8px; line-height: 1.5; margin: 10px 0 0 0;">
                        <i>Email ini dikirim pada: <span style="font-weight: bold;">${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</span></i>
                    </p>
                    `
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                    }
                })
            }

            return res.status(200).json({
                data: request.data,
                message: "Tambah Permintaan RB Berhasil",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Tambah Permintaan RB
export async function edit_request(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: RequestRB = {
            idCreated: res.locals.userinfo.id,
            idBagianCreated: res.locals.idBagian,
            timeCreated: new Date().toISOString(),
            oldid: Number(req.body.oldid),
            data: req.body.data
        }

        const request = await usersRB.edit_request(postData)

        if ('data' in request!) {
            const toAdminEmail = await get_admin_mail()
            const ccDcoEmail = await get_dco_mail()
            if ('data' in toAdminEmail! && 'data' in ccDcoEmail! && toAdminEmail!.data!.length > 0) {
                let index: number = 1;
                const daftarPermintaan = postData.data?.map((item) => {
                    return item.mbr.map(mbr => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${index++}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${item.namaProduk}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.no_mbr}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.tipe_mbr}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left; color: black;">${mbr.jumlah}</td>
                        </tr>
                    `).join(""); // Gabungkan hasil dari `map()`
                }).join("");
                const toMailList = toAdminEmail.data!.map(item => item.email).join(', ')
                const ccMailList = ccDcoEmail!.data!.map(item => item.email).join(', ')
                const mailOptions: MailOptions = {
                    sender: process.env.USER_MAIL! as string,
                    to: toMailList,
                    cc: ccMailList,
                    subject: `[No Reply] Konfirmasi Pengajuan Ulang Permintaan Nomor MBR - ${request.data?.requestRB.namaBagianCreated} - ${request.data?.requestRB.namaCreated}`,
                    html: `
                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">Dengan Hormat,</p>

                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
                        Mohon dapat melakukan konfirmasi permintaan nomor MBR yang dibuat ulang oleh: 
                        <span style="color: black; font-weight: bold;">${request.data?.requestRB.namaBagianCreated}&#8203; - ${request.data?.requestRB.namaCreated}&#8203;</span>
                    </p>
                    <p>ID transaksi: ${request.data?.requestRB.id}</p>
                    <table style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid black;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">No.</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Nama Produk</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Nomor MBR</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Tipe MBR</th>
                                <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2; color: black;">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${daftarPermintaan}
                        </tbody>
                    </table>

                    <p style="color: black; font-size: 14px; line-height: 1.5; margin: 10px 0 0 0;">Terima kasih.</p>
                    <br/>
                    <br/>
                    <p style="color: gray; font-size: 8px; line-height: 1.5; margin: 10px 0 0 0;">
                        <i>Email ini dikirim pada: <span style="font-weight: bold;">${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</span></i>
                    </p>
                    `
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                    }
                })
            }

            console.log(postData.data)
            
            return res.status(200).json({
                data: request.data,
                message: "Tambah Permintaan RB Berhasil",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}


//ANCHOR - Get Permintaan RB
export async function get_list_request(req: Request, res: Response, next: NextFunction) {
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
            idBagian: res.locals.idBagian,
            keyword: req.query.keyword == undefined ? null : String(req.query.keyword),
            idProduk: req.query.idProduk == undefined ? null : Number(req.query.idProduk),
            status: req.query.status == undefined ? null : checkStatus(String(req.query.status)),
            used: req.query.used == undefined ? null : checkUsed(String(req.query.used)),
            year: req.query.year == undefined ? null : Number(req.query.year),
            limit: req.query.limit == undefined ? null : Number(req.query.limit),
            offset: req.query.offset == undefined ? null : Number(req.query.offset),
        }

        const request = await usersRB.get_request_by_bagian(data)

        console.log(data)

        if ('data' in request! && 'count' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Data Permintaan RB",
                status: "success",
                count: request.count
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }

}

//ANCHOR - Tanda RB Sudah Digunakan
export async function set_request_used(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id

        const request = await usersRB.set_request_used(Number(id))

        if ('data' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Tanda RB Sudah Digunakan",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Get Detail Permintaan RB Berdasarkan ID
export async function get_detail_request(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id

        const request = await usersRB.get_request_by_id(Number(id))

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

        const request = await usersRB.get_rb_return_by_product(Number(id), status, numberFind, limit, offset, startDate, endDate)

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

        const request = await usersRB.get_rb_return_by_product_and_permintaan(Number(id), Number(idPermintaan), status)

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

        const request = await usersRB.get_rb_return_by_id_permintaan(Number(idPermintaan), limit, offset)

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
            tanggal_kembali: tanggal_kembali == undefined ? undefined : tanggal_kembali == "" ? null : tanggal_kembali,
            idUser: Number(res.locals.idUser)
        }

        const checkIdUserNotNull = await usersRB.check_id_user_not_null(Number(idNomor))

        if (checkIdUserNotNull == true) {
            return res.status(200).json({
                message: "Nomor RB Sudah Dikonfirmasi Oleh DC",
                status: "error"
            });
        }


        //console.log(checkIdUserNotNull, idNomor)

        const request = await usersRB.set_nomor_rb_return(Number(idNomor), data)

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

//ANCHOR - Generate Report Dashboard User
export async function generate_report_dashboard_user(req: Request, res: Response, next: NextFunction) {
    try {
        const request = await usersRB.generate_report_dashboard_user(Number(res.locals.idBagian))

        if ('data' in request!) {
            return res.status(200).json({
                data: request.data,
                message: "Report Dashboard User",
                status: "success"
            });
        } else {
            throw request
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Generate Report Serah Terima
export async function generate_report_serah_terima(req: Request, res: Response, next: NextFunction) {
    try {
        const idBagian = Number(res.locals.idBagian)
        const startDate = req.query.startDate == undefined ? null : String(req.query.startDate)
        const endDate = req.query.endDate == undefined ? null : String(req.query.endDate)
        const idUser = Number(res.locals.idUser)

        function convertToUTC(datetimeString: string) {
            const localDate = new Date(`${datetimeString}:00`);
            return localDate.toISOString().replace('T', ' ').substring(0, 16);
        }

        if (startDate == null || endDate == null) {
            return res.status(400).json({
                message: "Start Date dan End Date Harus Diisi",
                status: "error"
            });
        }

        console.log(convertToUTC(startDate), convertToUTC(endDate))

        const request = await usersRB.generate_report_serah_terima(idBagian, idUser, convertToUTC(startDate), convertToUTC(endDate))

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

            const fileName = `Serah Terima RB ${request.data[0].namaBagian}-${new Date().toISOString().replace(/[:T-]/g, '').slice(0, 14)}.xlsx`;

            const workbook = new exceljs.Workbook();

            const sheet = workbook.addWorksheet("Serah Terima RB");

            for (let row = 0; row < 3; row++) {
                sheet.addRow([]);
            }


            sheet.addRow([
                "NO.",
                "NAMA PRODUK",
                "PO / PS",
                "NO. DOKUMEN",
                "NO. URUT RB / RP",
                "NOMOR BATCH",
                "KETERANGAN"
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
                { key: "POPS", width: 8 },
                { key: "noDokumen", width: 25 },
                { key: "nomorUrut", width: 20 },
                { key: "nomorBatch", width: 18 },
                { key: "keterangan", width: 21 },
            ];

            sheet.getColumn("id").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("namaProduk").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("POPS").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("noDokumen").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("nomorUrut").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("nomorBatch").alignment = { vertical: "middle", horizontal: "center" };
            sheet.getColumn("keterangan").alignment = { vertical: "middle", horizontal: "center" };


            let i = 1;

            (request.data as ILaporanSerahTerimaRB[]).forEach((item, index) => {
                const row = sheet.addRow({
                    id: i,
                    namaProduk: (index == 0 ? item.namaProduk : item.namaProduk == (request.data![index - 1] as ILaporanSerahTerimaRB).namaProduk ? "" : item.namaProduk),
                    POPS: item.tipeMBR,
                    noDokumen: item.nomorMBR,
                    nomorUrut: item.nomorUrut,
                    nomorBatch: item.nomorBatch ?? "",
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
            // sheet.getCell("A3").value = `BULAN: ${formattedStartDate} s.d ${formattedEndDate}`;
            // sheet.getCell("A3").font = { bold: true, name: "Helvetica", size: 11 };
            // sheet.getCell("A3").alignment = { vertical: "middle", horizontal: "left" };
            sheet.getCell("C3").value = `BAGIAN: ${request.data[0].namaBagian}`;
            sheet.getCell("C3").font = { bold: true, name: "Helvetica", size: 11 };
            sheet.getCell("C3").alignment = { vertical: "middle", horizontal: "center" };
            sheet.mergeCells("A2:E2");
            sheet.getCell("A2").value = `SERAH TERIMA REKAMAN BATCH / REKAMAN PROSES`;
            sheet.getCell("A2").font = { bold: true, name: "Helvetica", size: 11 };
            //Nomor Rekaman
            sheet.getCell("F1").value = `Nomor`;
            sheet.getCell("F1").font = { bold: false, name: "Helvetica", size: 11 };
            sheet.getCell("F1").alignment = { vertical: "middle", horizontal: "left" };
            sheet.getCell("G1").value = `: AA-00147-00`;
            sheet.getCell("G1").font = { bold: false, name: "Helvetica", size: 11 };
            sheet.getCell("G1").alignment = { vertical: "middle", horizontal: "left" };
            //Tanggal Rekaman
            sheet.getCell("F2").value = `Tanggal`;
            sheet.getCell("F2").font = { bold: false, name: "Helvetica", size: 11 };
            sheet.getCell("F2").alignment = { vertical: "middle", horizontal: "left" };
            sheet.getCell("G2").value = `: 30-05-2024`;
            sheet.getCell("G2").font = { bold: false, name: "Helvetica", size: 11 };
            sheet.getCell("G2").alignment = { vertical: "middle", horizontal: "left" };
            //sheet.getCell("C2").alignment = { vertical: "middle", horizontal: "left" };

            for (let row = 1; row <= 3; row++) {
                for (let col = 1; col <= 7; col++) {
                    const cell = sheet.getCell(row, col);
                    if (row === 1) cell.border = { ...cell.border, top: { style: "thin" } };
                    if (row === 3) cell.border = { ...cell.border, bottom: { style: "thin" } };
                    if (col === 1) cell.border = { ...cell.border, left: { style: "thin" } };
                    if (col === 6) cell.border = { ...cell.border, left: { style: "thin" } };
                    if (col === 7) cell.border = { ...cell.border, right: { style: "thin" } };
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
