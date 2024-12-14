"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.confirm_request = confirm_request;
exports.get_recap_request = get_recap_request;
exports.get_request_lists = get_request_lists;
exports.get_request_by_department = get_request_by_department;
exports.get_request_by_produk = get_request_by_produk;
exports.get_nomor_by_id = get_nomor_by_id;
exports.get_nomor_request_by_id = get_nomor_request_by_id;
exports.get_request_by_id = get_request_by_id;
exports.get_rb_return_by_product = get_rb_return_by_product;
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
exports.confirm_rb_return = confirm_rb_return;
exports.generate_report_rb_belum_kembali_perbagian = generate_report_rb_belum_kembali_perbagian;
exports.generate_report_dashboard_admin = generate_report_dashboard_admin;
const adminProductRb = __importStar(require("../../services/admin/admin_product_rb_service"));
const client_1 = require("@prisma/client");
const exceljs = __importStar(require("exceljs"));
//ANCHOR - Konfirmasi RB
function confirm_request(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let postData = {
                id: req.params.id,
                action: req.body.action,
                timeConfirmed: new Date().toISOString(),
                idConfirmed: res.locals.userinfo.id,
                reason: (_a = req.body.reason) !== null && _a !== void 0 ? _a : ""
            };
            if (postData.action == "confirm") {
                const confirmPermintaan = yield adminProductRb.accept_permintaan(postData);
                if ('data' in confirmPermintaan) {
                    return res.status(200).json({
                        data: confirmPermintaan.data,
                        message: "Confirm Permintaan Berhasil",
                        status: "success"
                    });
                }
                else {
                    throw confirmPermintaan;
                }
            }
            if (postData.action == "reject") {
                const confirmPermintaan = yield adminProductRb.reject_permintaan(postData);
                if ('data' in confirmPermintaan) {
                    return res.status(200).json({
                        data: confirmPermintaan.data,
                        message: "Reject Permintaan Berhasil",
                        status: "success"
                    });
                }
                else {
                    throw confirmPermintaan;
                }
            }
            return res.status(204).json({
                message: "No Content",
                status: "success"
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - menampilkan semua data rekap permintaan semua bagian
function get_recap_request(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let postData = {
                tahun: (_a = req.query.tahun) === null || _a === void 0 ? void 0 : _a.toString()
            };
            const tahun = postData.tahun !== undefined ? parseInt(postData.tahun) : new Date().getFullYear();
            const idBagian = res.locals.userinfo.isAdmin == true ? undefined : res.locals.userinfo.bagian_jabatan[0].id_bagian;
            const data = {
                tahun: tahun,
                idBagian: idBagian
            };
            const getRecap = yield adminProductRb.get_recap_permintaan(data);
            if ('data' in getRecap) {
                return res.status(200).json({
                    data: getRecap.data,
                    count: getRecap.count,
                    status: "success"
                });
            }
            else {
                throw getRecap;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - menampilkan semua data permintaan berdasarkan status PENDING | DITERIMA | DITOLAK | ALL
function get_request_lists(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            function checkStatus(status) {
                if (status == "all") {
                    return null;
                }
                if (status == "onlyConfirmed") {
                    return client_1.Konfirmasi["DITERIMA"];
                }
                if (status == "onlyPending") {
                    return client_1.Konfirmasi["PENDING"];
                }
                if (status == "onlyRejected") {
                    return client_1.Konfirmasi["DITOLAK"];
                }
                return null;
            }
            function checkUsed(used) {
                if (used == "onlyUsed") {
                    return true;
                }
                if (used == "onlyAvailable") {
                    return false;
                }
                return null;
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
            };
            const listPending = yield adminProductRb.get_permintaan(data);
            if ('data' in listPending) {
                return res.status(200).json({
                    data: listPending.data,
                    count: listPending.count,
                    status: "success"
                });
            }
            else {
                throw listPending;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Mencari daftar produk sesuai bagian
function get_request_by_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            let postData = {
                idBagian: (_a = req.query.id_bagian) === null || _a === void 0 ? void 0 : _a.toString(),
                tahun: (_b = req.query.tahun) === null || _b === void 0 ? void 0 : _b.toString()
            };
            const data = {
                idBagian: parseInt(postData.idBagian),
                tahun: parseInt(postData.tahun)
            };
            const listsByBagian = yield adminProductRb.get_permintaan_bagian(data);
            if ('data' in listsByBagian) {
                return res.status(200).json({
                    data: listsByBagian.data,
                    count: listsByBagian.count,
                    status: "success"
                });
            }
            else {
                throw listsByBagian;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Mencari daftar permintaan sesuai produk
function get_request_by_produk(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            let postData = {
                idProduk: (_a = req.query.id_produk) === null || _a === void 0 ? void 0 : _a.toString(),
                tahun: (_b = req.query.tahun) === null || _b === void 0 ? void 0 : _b.toString(),
                month: ((_c = req.query.bulan) === null || _c === void 0 ? void 0 : _c.toString()) == "" ? undefined : (_d = req.query.bulan) === null || _d === void 0 ? void 0 : _d.toString()
            };
            const data = {
                idProduk: parseInt(postData.idProduk),
                tahun: parseInt(postData.tahun),
                month: postData.month != undefined ? parseInt(postData.month) : undefined
            };
            const listsByProduk = yield adminProductRb.get_permintaan_produk(data);
            if ('data' in listsByProduk) {
                return res.status(200).json({
                    data: listsByProduk.data,
                    count: listsByProduk.count,
                    status: "success"
                });
            }
            else {
                throw listsByProduk;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Menampilkan semua nomor urut berdasarkan idPermintaan
function get_nomor_by_id(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            let postData = {
                idPermintaan: (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString(),
                idProduk: (_b = req.query.id_produk) === null || _b === void 0 ? void 0 : _b.toString()
            };
            const data = {
                idPermintaan: parseInt(postData.idPermintaan),
                idProduk: parseInt(postData.idProduk)
            };
            const listsByProduk = yield adminProductRb.get_nomor_by_id(data);
            if ('data' in listsByProduk) {
                return res.status(200).json({
                    data: listsByProduk.data,
                    count: listsByProduk.count,
                    status: "success"
                });
            }
            else {
                throw listsByProduk;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Menampilkan semua nomor urut berdasarkan idPermintaan
function get_nomor_request_by_id(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let postData = {
                idPermintaan: (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString()
            };
            const data = {
                idPermintaan: parseInt(postData.idPermintaan)
            };
            const listsByIdPermintaan = yield adminProductRb.get_nomor_permintaan_by_id(data);
            if ('data' in listsByIdPermintaan) {
                return res.status(200).json({
                    data: listsByIdPermintaan.data,
                    status: "success"
                });
            }
            else {
                throw listsByIdPermintaan;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Menampilkan daftar permintaan berdasarkan idPermintaan
function get_request_by_id(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let postData = {
                idPermintaan: (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString()
            };
            const data = {
                idPermintaan: parseInt(postData.idPermintaan)
            };
            const listsByProduk = yield adminProductRb.get_permintaan_by_id(data);
            if ('data' in listsByProduk) {
                return res.status(200).json({
                    data: listsByProduk.data,
                    count: listsByProduk.count,
                    status: "success"
                });
            }
            else {
                throw listsByProduk;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
// Pengembalian RB
//ANCHOR - Get RB Return By Product
function get_rb_return_by_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const status = req.query.status == undefined ? null : String(req.query.status);
            const limit = req.query.limit == undefined ? null : Number(req.query.limit);
            const offset = req.query.offset == undefined ? null : Number(req.query.offset);
            const startDate = req.query.startDate == undefined ? null : String(req.query.startDate);
            const endDate = req.query.endDate == undefined ? null : String(req.query.endDate);
            const numberFind = req.query.number == undefined ? null : String(req.query.number);
            const request = yield adminProductRb.get_rb_return_by_product(Number(id), status, numberFind, limit, offset, startDate, endDate);
            if ('data' in request && 'count' in request) {
                //console.log(request.data)
                return res.status(200).json({
                    data: request.data,
                    count: Number(request.count),
                    message: "Detail Permintaan RB",
                    status: "success",
                    limit: limit,
                    offset: offset
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Get RB Return By Product and Permintaan
function get_rb_return_by_product_and_permintaan(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const idPermintaan = req.params.idPermintaan;
            const status = req.query.status == undefined ? null : String(req.query.status);
            const request = yield adminProductRb.get_rb_return_by_product_and_permintaan(Number(id), Number(idPermintaan), status);
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Detail Permintaan RB",
                    status: "success"
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Get RB Return By ID Permintaan
function get_rb_return_by_id_permintaan(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idPermintaan = req.params.idPermintaan;
            const limit = req.query.limit == undefined ? null : Number(req.query.limit);
            const offset = req.query.offset == undefined ? null : Number(req.query.offset);
            const request = yield adminProductRb.get_rb_return_by_id_permintaan(Number(idPermintaan), limit, offset);
            if ('data' in request && 'count' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Detail Permintaan RB",
                    count: request.count,
                    status: "success"
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Update Nomor RB Return
function set_nomor_rb_return(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idNomor = req.params.idNomor;
            const { status, nomor_batch, tanggal_kembali } = req.body;
            const data = {
                status: status == undefined ? undefined : client_1.Status[status],
                nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch,
                tanggal_kembali: tanggal_kembali == undefined ? undefined : tanggal_kembali == "" ? null : tanggal_kembali
            };
            const request = yield adminProductRb.set_nomor_rb_return(Number(idNomor), data);
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Nomor RB Return Telah Diupdate",
                    status: "success"
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next;
        }
    });
}
//ANCHOR - Confirm RB Return
function confirm_rb_return(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const idAdmin = res.locals.userinfo.id;
            //console.log(idAdmin)
            const request = yield adminProductRb.confirm_rb_return(Number(id), idAdmin);
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Konfirmasi RB Return Berhasil",
                    status: "success"
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Laporan RB Belum Kembali Perbagian
function generate_report_rb_belum_kembali_perbagian(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idBagian = req.query.idBagian == undefined ? null : Number(req.query.idBagian);
            const startDate = req.query.startDate == undefined ? null : String(req.query.startDate);
            const endDate = req.query.endDate == undefined ? null : String(req.query.endDate);
            const statusReq = req.query.statusKembali == undefined ? null : String(req.query.statusKembali);
            const date1input = startDate !== null && startDate !== void 0 ? startDate : "01-2024";
            const [month1, year1] = date1input.split("-");
            const date1 = new Date(`${year1}-${month1}-01`);
            const formattedStartDate = new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long" }).format(date1);
            const date2input = endDate !== null && endDate !== void 0 ? endDate : "12-2024"; // Format MM-YY
            const [month2, year2] = date2input.split("-");
            const date2 = new Date(`${year2}-${month2}-01`); // Mengonversi ke Date
            const formattedEndDate = new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long" }).format(date2);
            let status = null;
            if (statusReq !== null && statusReq == "belum") {
                status = client_1.Status.ACTIVE;
            }
            const request = yield adminProductRb.get_laporan_rb_belum_kembali_perbagian(idBagian, status, startDate, endDate);
            if ('data' in request) {
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
                request.data.forEach((item, index) => {
                    var _a;
                    //const statusCapitalized = item.status.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                    const row = sheet.addRow({
                        id: i,
                        timeConfirmed: new Date(item.timeConfirmed).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            timeZone: "Asia/Jakarta",
                        }),
                        namaProduk: (index == 0 ? item.namaProduk : item.namaProduk == request.data[index - 1].namaProduk ? "" : item.namaProduk),
                        PO: item.tipeMBR == "PO" ? "V" : "",
                        PS: item.tipeMBR == "PS" ? "V" : "",
                        nomorUrut: item.nomorUrut,
                        nomorBatch: (_a = item.nomorBatch) !== null && _a !== void 0 ? _a : "",
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
                        if (row === 1)
                            cell.border = Object.assign(Object.assign({}, cell.border), { top: { style: "thin" } });
                        if (row === 3)
                            cell.border = Object.assign(Object.assign({}, cell.border), { bottom: { style: "thin" }, top: { style: "thin" } });
                        if (col === 1)
                            cell.border = Object.assign(Object.assign({}, cell.border), { left: { style: "thin" } });
                        if (col === 7)
                            cell.border = Object.assign(Object.assign({}, cell.border), { left: { style: "thin" } });
                        if (col === 9)
                            cell.border = Object.assign(Object.assign({}, cell.border), { right: { style: "thin" } });
                    }
                }
                res.header('Access-Control-Expose-Headers', 'Content-Disposition');
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                yield workbook.xlsx.write(res);
                return res.end();
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Laporan Dashboard Admin
function generate_report_dashboard_admin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = yield adminProductRb.generate_report_dashboard_admin();
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Konfirmasi RB Return Berhasil",
                    status: "success"
                });
            }
            else {
                throw request;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
