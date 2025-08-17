"use strict";
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
async function get_kategori(data) {
    try {
        const getKategori = await prisma.kategori.findMany({
            select: {
                id: true,
                namaKategori: true,
                startingNumber: true
            },
            where: {
                namaKategori: {
                    contains: data.search_kategori ?? undefined
                }
            },
            orderBy: {
                id: "asc"
            },
            skip: data.offset ?? undefined,
            take: data.limit ?? undefined
        });
        const count = await prisma.kategori.count({
            where: {
                namaKategori: {
                    contains: data.search_kategori ?? undefined
                }
            }
        });
        return { data: getKategori, count: count };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Tambah Produk
async function add_product(data) {
    try {
        const addProduct = await prisma.produk.create({
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
}
// ANCHOR - Get Product berdasarkan bagian
async function get_product_by_bagian(data) {
    try {
        let result = [];
        const getProduct = await prisma.produk.findMany({
            where: {
                AND: [
                    {
                        idBagian: data.idBagian ?? undefined,
                    },
                    {
                        namaProduk: {
                            contains: data.namaProduk ?? undefined
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
            skip: data.offset ?? undefined,
            take: data.limit ?? undefined
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
        const countProduct = await prisma.produk.count({
            where: {
                AND: [
                    {
                        idBagian: data.idBagian ?? undefined,
                    },
                    {
                        namaProduk: {
                            contains: data.namaProduk ?? undefined
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
}
// ANCHOR - Check Product
async function check_product(data) {
    try {
        const checkProduct = await prisma.produk.count({
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
}
//ANCHOR - Delete Product
async function delete_product(id) {
    try {
        const deleteProduct = await prisma.produk.delete({
            where: {
                id: id
            }
        });
        return { data: deleteProduct };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Edit Product
async function edit_product(id, data) {
    try {
        const editProduct = await prisma.produk.update({
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
}
