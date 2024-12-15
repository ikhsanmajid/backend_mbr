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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_request = add_request;
exports.edit_request = edit_request;
exports.get_list_request = get_list_request;
exports.set_request_used = set_request_used;
exports.get_detail_request = get_detail_request;
exports.get_rb_return_by_product = get_rb_return_by_product;
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
exports.generate_report_dashboard_user = generate_report_dashboard_user;
exports.generate_report_serah_terima = generate_report_serah_terima;
const usersRB = __importStar(require("../../services/users/users_rb_service"));
const client_1 = require("@prisma/client");
const exceljs_1 = __importDefault(require("exceljs"));
//ANCHOR - Tambah Permintaan RB
function add_request(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postData = {
                idCreated: res.locals.userinfo.id,
                idBagianCreated: res.locals.idBagian,
                timeCreated: new Date().toISOString(),
                data: req.body.data
            };
            const request = yield usersRB.add_request(postData);
            if ('data' in request) {
                res.status(200).json({
                    data: request.data,
                    message: "Tambah Permintaan RB Berhasil",
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
//ANCHOR - Tambah Permintaan RB
function edit_request(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postData = {
                idCreated: res.locals.userinfo.id,
                idBagianCreated: res.locals.idBagian,
                timeCreated: new Date().toISOString(),
                oldid: Number(req.body.oldid),
                data: req.body.data
            };
            const request = yield usersRB.edit_request(postData);
            if ('data' in request) {
                res.status(200).json({
                    data: request.data,
                    message: "Tambah Permintaan RB Berhasil",
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
//ANCHOR - Get Permintaan RB
function get_list_request(req, res, next) {
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
                idBagian: res.locals.idBagian,
                keyword: req.query.keyword == undefined ? null : String(req.query.keyword),
                idProduk: req.query.idProduk == undefined ? null : Number(req.query.idProduk),
                status: req.query.status == undefined ? null : checkStatus(String(req.query.status)),
                used: req.query.used == undefined ? null : checkUsed(String(req.query.used)),
                year: req.query.year == undefined ? null : Number(req.query.year),
                limit: req.query.limit == undefined ? null : Number(req.query.limit),
                offset: req.query.offset == undefined ? null : Number(req.query.offset),
            };
            const request = yield usersRB.get_request_by_bagian(data);
            console.log(data);
            if ('data' in request && 'count' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Data Permintaan RB",
                    status: "success",
                    count: request.count
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
//ANCHOR - Tanda RB Sudah Digunakan
function set_request_used(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const request = yield usersRB.set_request_used(Number(id));
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Tanda RB Sudah Digunakan",
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
//ANCHOR - Get Detail Permintaan RB Berdasarkan ID
function get_detail_request(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const request = yield usersRB.get_request_by_id(Number(id));
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
            const request = yield usersRB.get_rb_return_by_product(Number(id), status, numberFind, limit, offset, startDate, endDate);
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
            const request = yield usersRB.get_rb_return_by_product_and_permintaan(Number(id), Number(idPermintaan), status);
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
            const request = yield usersRB.get_rb_return_by_id_permintaan(Number(idPermintaan), limit, offset);
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
                nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch.trim(),
                tanggal_kembali: tanggal_kembali == undefined ? undefined : tanggal_kembali == "" ? null : tanggal_kembali
            };
            const checkIdUserNotNull = yield usersRB.check_id_user_not_null(Number(idNomor));
            if (checkIdUserNotNull == true) {
                return res.status(200).json({
                    message: "Nomor RB Sudah Dikonfirmasi Oleh DC",
                    status: "error"
                });
            }
            //console.log(checkIdUserNotNull, idNomor)
            const request = yield usersRB.set_nomor_rb_return(Number(idNomor), data);
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
//ANCHOR - Generate Report Dashboard User
function generate_report_dashboard_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = yield usersRB.generate_report_dashboard_user(Number(res.locals.idBagian));
            if ('data' in request) {
                return res.status(200).json({
                    data: request.data,
                    message: "Report Dashboard User",
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
//ANCHOR - Generate Report Serah Terima
function generate_report_serah_terima(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idBagian = Number(res.locals.idBagian);
            const startDate = req.query.startDate == undefined ? null : String(req.query.startDate);
            const endDate = req.query.endDate == undefined ? null : String(req.query.endDate);
            function convertToUTC(datetimeString) {
                const localDate = new Date(`${datetimeString}:00`);
                return localDate.toISOString().replace('T', ' ').substring(0, 16);
            }
            if (startDate == null || endDate == null) {
                return res.status(400).json({
                    message: "Start Date dan End Date Harus Diisi",
                    status: "error"
                });
            }
            console.log(convertToUTC(startDate), convertToUTC(endDate));
            const request = yield usersRB.generate_report_serah_terima(idBagian, convertToUTC(startDate), convertToUTC(endDate));
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
                const fileName = `Serah Terima RB ${request.data[0].namaBagian}-${new Date().toISOString().replace(/[:T-]/g, '').slice(0, 14)}.xlsx`;
                const workbook = new exceljs_1.default.Workbook();
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
                request.data.forEach((item, index) => {
                    var _a;
                    const row = sheet.addRow({
                        id: i,
                        namaProduk: (index == 0 ? item.namaProduk : item.namaProduk == request.data[index - 1].namaProduk ? "" : item.namaProduk),
                        POPS: item.tipeMBR,
                        noDokumen: item.nomorMBR,
                        nomorUrut: item.nomorUrut,
                        nomorBatch: (_a = item.nomorBatch) !== null && _a !== void 0 ? _a : "",
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
                        if (row === 1)
                            cell.border = Object.assign(Object.assign({}, cell.border), { top: { style: "thin" } });
                        if (row === 3)
                            cell.border = Object.assign(Object.assign({}, cell.border), { bottom: { style: "thin" } });
                        if (col === 1)
                            cell.border = Object.assign(Object.assign({}, cell.border), { left: { style: "thin" } });
                        if (col === 6)
                            cell.border = Object.assign(Object.assign({}, cell.border), { left: { style: "thin" } });
                        if (col === 7)
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
