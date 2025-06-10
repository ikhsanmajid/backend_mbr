"use strict";
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
exports.get_product_by_bagian = get_product_by_bagian;
exports.check_product = check_product;
exports.delete_product = delete_product;
exports.edit_product = edit_product;
const client_1 = require("@prisma/client");
//SECTION - Product Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Get Kategori
function get_kategori(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const getKategori = yield prisma.kategori.findMany({
                select: {
                    id: true,
                    namaKategori: true,
                    startingNumber: true
                },
                where: {
                    namaKategori: {
                        contains: (_a = data.search_kategori) !== null && _a !== void 0 ? _a : undefined
                    }
                },
                orderBy: {
                    id: "asc"
                },
                skip: (_b = data.offset) !== null && _b !== void 0 ? _b : undefined,
                take: (_c = data.limit) !== null && _c !== void 0 ? _c : undefined
            });
            const count = yield prisma.kategori.count({
                where: {
                    namaKategori: {
                        contains: (_d = data.search_kategori) !== null && _d !== void 0 ? _d : undefined
                    }
                }
            });
            return { data: getKategori, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Tambah Produk
function add_product(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const addProduct = yield prisma.produk.create({
                data: {
                    namaProduk: data.namaProduk,
                    idBagian: data.idBagian,
                    idKategori: data.idKategori,
                },
                select: {
                    id: true,
                    idBagian: true,
                    idKategori: true
                }
            });
            return { data: addProduct };
        }
        catch (error) {
            throw error;
        }
    });
}
// ANCHOR - Get Product berdasarkan bagian
function get_product_by_bagian(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            let result = [];
            const getProduct = yield prisma.produk.findMany({
                where: {
                    AND: [
                        {
                            idBagian: (_a = data.idBagian) !== null && _a !== void 0 ? _a : undefined,
                        },
                        {
                            namaProduk: {
                                contains: (_b = data.namaProduk) !== null && _b !== void 0 ? _b : undefined
                            }
                        },
                        {
                            isActive: data.status == null ? undefined : data.status
                        }
                    ]
                },
                select: {
                    id: true,
                    namaProduk: true,
                    idBagian: true,
                    idBagianFK: {
                        select: {
                            namaBagian: true
                        }
                    },
                    idKategori: true,
                    idKategoriFK: {
                        select: {
                            namaKategori: true
                        }
                    },
                    isActive: true
                },
                orderBy: [{
                        idBagianFK: {
                            namaBagian: "asc"
                        },
                    }, {
                        namaProduk: "asc"
                    }],
                skip: (_c = data.offset) !== null && _c !== void 0 ? _c : undefined,
                take: (_d = data.limit) !== null && _d !== void 0 ? _d : undefined
            });
            if (getProduct.length > 0) {
                getProduct.map((item) => {
                    result.push({
                        id: item.id,
                        namaProduk: item.namaProduk,
                        idBagian: item.idBagian,
                        namaBagian: item.idBagianFK.namaBagian,
                        idKategori: item.idKategori,
                        namaKategori: item.idKategoriFK.namaKategori,
                        isActive: item.isActive
                    });
                });
            }
            const countProduct = yield prisma.produk.count({
                where: {
                    AND: [
                        {
                            idBagian: (_e = data.idBagian) !== null && _e !== void 0 ? _e : undefined,
                        },
                        {
                            namaProduk: {
                                contains: (_f = data.namaProduk) !== null && _f !== void 0 ? _f : undefined
                            }
                        },
                        {
                            isActive: data.status == null ? undefined : data.status
                        }
                    ]
                }
            });
            return { data: result, count: countProduct };
        }
        catch (error) {
            throw error;
        }
    });
}
// ANCHOR - Check Product
function check_product(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkProduct = yield prisma.produk.count({
                where: {
                    AND: [
                        {
                            namaProduk: data.namaProduk
                        },
                        {
                            idBagian: Number(data.idBagian)
                        }
                    ]
                }
            });
            return { count: checkProduct };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Delete Product
function delete_product(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteProduct = yield prisma.produk.delete({
                where: {
                    id: id
                }
            });
            return { data: deleteProduct };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Edit Product
function edit_product(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const editProduct = yield prisma.produk.update({
                where: {
                    id: id
                },
                data: {
                    namaProduk: data.namaProduk,
                    idBagian: data.idBagian,
                    idKategori: data.idKategori,
                    isActive: data.isActive
                }
            });
            return { data: editProduct };
        }
        catch (error) {
            throw error;
        }
    });
}
