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
exports.get_kategori = get_kategori;
exports.add_product = add_product;
exports.get_product = get_product;
exports.check_product = check_product;
exports.delete_product = delete_product;
exports.edit_product = edit_product;
const adminProduct = __importStar(require("../../services/admin/admin_product_service"));
//ANCHOR - Get Kategori
function get_kategori(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kategori = yield adminProduct.get_kategori();
            if ('data' in kategori) {
                res.status(200).json({
                    data: kategori.data,
                    message: "Data Kategori",
                    status: "success"
                });
            }
            else {
                throw kategori;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Tambah produk
function add_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama_produk, id_bagian, id_kategori } = req.body;
            const decodedNamaProduk = decodeURIComponent(nama_produk);
            let postData = {
                namaProduk: decodedNamaProduk,
                idBagian: Number(id_bagian),
                idKategori: Number(id_kategori)
            };
            if (nama_produk == "" || id_bagian == "" || id_kategori == "") {
                return res.status(400).json({
                    message: "Data Tidak Boleh Kosong",
                    status: "error",
                    type: "error"
                });
            }
            const product = yield adminProduct.add_product(postData);
            if ('data' in product) {
                res.status(200).json({
                    data: product.data,
                    message: "Tambah Produk Berhasil",
                    status: "success"
                });
            }
            else {
                throw product;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
// ANCHOR - Check Product
function get_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_bagian, nama_produk, status, limit, offset } = req.query;
            const decodedNamaProduk = decodeURIComponent(nama_produk);
            const statusProduk = (status) => {
                if (status == "active") {
                    return true;
                }
                else if (status == "inactive") {
                    return false;
                }
                else if (typeof status == "undefined") {
                    return null;
                }
                else {
                    return null;
                }
            };
            let getData = {
                idBagian: res.locals.userinfo.isAdmin == true ? id_bagian == undefined ? null : Number(id_bagian) : res.locals.idBagian,
                namaProduk: nama_produk == undefined || nama_produk == "" ? null : decodedNamaProduk.toString(),
                status: statusProduk(status),
                limit: limit == undefined ? null : Number(limit),
                offset: offset == undefined ? null : Number(offset)
            };
            const product = yield adminProduct.get_product_by_bagian(getData);
            if ('data' in product && 'count' in product) {
                return res.status(200).json({
                    data: product.data,
                    message: "Data Produk",
                    status: "success",
                    count: product.count,
                });
            }
            else {
                throw product;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Check Product Exist
function check_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama_produk, id_bagian } = req.query;
            const decodedNamaProduk = decodeURIComponent(nama_produk);
            const product = yield adminProduct.check_product({ namaProduk: decodedNamaProduk, idBagian: id_bagian });
            if ('count' in product) {
                console.log({ count: product.count, data: { nama_produk, id_bagian } });
                if (product.count > 0) {
                    return res.status(200).json({
                        message: "exist",
                        status: "success"
                    });
                }
                else {
                    return res.status(200).json({
                        message: "not exist",
                        status: "success"
                    });
                }
            }
            else {
                throw product;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Delete Product
function delete_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const product = yield adminProduct.delete_product(Number(id));
            if ('data' in product) {
                return res.status(200).json({
                    message: "Delete Berhasil",
                    status: "success"
                });
            }
            else {
                throw product;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Edit Product
function edit_product(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { nama_produk, id_bagian, id_kategori, is_active } = req.body;
            const decodedNamaProduk = decodeURIComponent(nama_produk);
            let putData = {
                namaProduk: decodedNamaProduk,
                idBagian: Number(id_bagian),
                idKategori: Number(id_kategori),
                isActive: is_active == "1" ? true : false
            };
            //console.log("data 1", is_active)
            if (nama_produk == "" || id_bagian == "" || id_kategori == "" || is_active == "") {
                return res.status(400).json({
                    message: "Data Tidak Boleh Kosong",
                    status: "error",
                    type: "error"
                });
            }
            const product = yield adminProduct.edit_product(Number(id), putData);
            if ('data' in product) {
                return res.status(200).json({
                    message: "Edit Berhasil",
                    status: "success"
                });
            }
            else {
                throw product;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
