import { Konfirmasi, Prisma, PrismaClient, Status } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";


//SECTION - Product Model Admin
const prisma = new PrismaClient();

interface kategori {
    id?: string | number;
    namaKategori?: string;
    startingNumber?: string;
}

interface produk {
    id?: string | number;
    namaProduk?: string;
    idBagian?: number | string;
    namaBagian?: string;
    idKategori?: number | string;
    namaKategori?: string;
    isActive?: boolean;
}

//ANCHOR - Get Kategori
export async function get_kategori(data: { limit: number | null, offset: number | null, search_kategori: string | null }): Promise<ResultModel<kategori[] | null> | { data: string }> {
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
        })

        const count = await prisma.kategori.count({
            where: {
                namaKategori: {
                    contains: data.search_kategori ?? undefined
                }
            }
        })

        return { data: getKategori, count: count }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Tambah Produk
export async function add_product(data: { namaProduk: string, idBagian: number, idKategori: number }): Promise<ResultModel<produk | null> | { data: string }> {
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
        })

        return { data: addProduct }
    } catch (error) {
        throw error
    }
}

// ANCHOR - Get Product berdasarkan bagian
export async function get_product_by_bagian(data: { idBagian: number | null, namaProduk: string | null, status: boolean | null, limit: null | number, offset: null | number }): Promise<ResultModel<produk[] | null> | { data: string }> {
    try {
        let result: produk[] = []
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
        })

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
                })
            })
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
        })

        return { data: result, count: countProduct }
    } catch (error) {
        throw error
    }

}

// ANCHOR - Check Product
export async function check_product(data: { namaProduk: string, idBagian: number | string }): Promise<ResultModel<produk | null> | { data: string }> {
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
        })

        return { count: checkProduct }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Delete Product
export async function delete_product(id: number): Promise<ResultModel<produk | null> | { data: string }> {
    try {
        const deleteProduct = await prisma.produk.delete({
            where: {
                id: id
            }
        })

        return { data: deleteProduct }
    } catch (error) {
        throw error
    }
}

//ANCHOR - Edit Product
export async function edit_product(id: number, data: { namaProduk: string, idBagian: number, idKategori: number, isActive: boolean }): Promise<ResultModel<produk | null> | { data: string }> {
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
        })

        return { data: editProduct }
    } catch (error) {
        throw error
    }
}