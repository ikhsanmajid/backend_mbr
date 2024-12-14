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
exports.add_request = add_request;
exports.edit_request = edit_request;
exports.get_list_request = get_list_request;
exports.set_request_used = set_request_used;
exports.get_detail_request = get_detail_request;
exports.get_rb_return_by_product = get_rb_return_by_product;
exports.get_rb_return_by_product_and_permintaan = get_rb_return_by_product_and_permintaan;
exports.get_rb_return_by_id_permintaan = get_rb_return_by_id_permintaan;
exports.set_nomor_rb_return = set_nomor_rb_return;
const usersRB = __importStar(require("../../services/users/users_rb_service"));
const client_1 = require("@prisma/client");
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
                nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch,
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
