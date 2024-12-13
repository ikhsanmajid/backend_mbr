import { NextFunction, Request, Response } from "express";
import * as adminProduct from "../../services/admin/admin_product_service";

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

//ANCHOR - Get Kategori
export async function get_kategori(req: Request, res: Response, next: NextFunction) {
    try {
        const kategori = await adminProduct.get_kategori()

        if ('data' in kategori!) {
            res.status(200).json({
                data: kategori.data,
                message: "Data Kategori",
                status: "success"
            });
        } else {
            throw kategori
        }
    } catch (error) {
        return next(error)
    }
}


//ANCHOR - Tambah produk
export async function add_product(req: Request, res: Response, next: NextFunction) {
    try {
        const {nama_produk, id_bagian, id_kategori} = req.body

        const decodedNamaProduk = decodeURIComponent(nama_produk)

        let postData: {namaProduk: string, idBagian: number, idKategori: number} = {
            namaProduk: decodedNamaProduk,
            idBagian: Number(id_bagian),
            idKategori: Number(id_kategori)
        }

        if (nama_produk == "" || id_bagian == "" || id_kategori == "") {
            return res.status(400).json({
                message: "Data Tidak Boleh Kosong",
                status: "error",
                type: "error"
            });
        }

        const product = await adminProduct.add_product(postData)

        if ('data' in product!) {
            res.status(200).json({
                data: product.data,
                message: "Tambah Produk Berhasil",
                status: "success"
            });
        } else {
            throw product
        }
    } catch (error) {
        return next(error)
    }
}

// ANCHOR - Check Product
export async function get_product(req: Request, res: Response, next: NextFunction) {
    try {
        const {id_bagian, nama_produk, status, limit, offset} = req.query

        const decodedNamaProduk = decodeURIComponent(nama_produk as string)
        
        const statusProduk = (status: string | undefined) => {
            if (status == "active") {
                return true
            }else if (status == "inactive") {
                return false
            }else if (typeof status == "undefined") {
                return null
            }else {
                return null
            }
        }

        let getData: { idBagian: null | number, namaProduk: string | null, status: boolean | null, limit: null | number, offset: null | number} = {
            idBagian: res.locals.userinfo.isAdmin == true ? id_bagian == undefined ? null : Number(id_bagian) : res.locals.idBagian,
            namaProduk: nama_produk == undefined || nama_produk == "" ? null : decodedNamaProduk.toString(),
            status: statusProduk(status as string | undefined),
            limit: limit == undefined ? null : Number(limit),
            offset: offset == undefined ? null : Number(offset)
        }

        const product = await adminProduct.get_product_by_bagian(getData)

        if ('data' in product! && 'count' in product!) {
            return res.status(200).json({
                data: product.data,
                message: "Data Produk",
                status: "success",
                count: product.count,
            });
        } else {
            throw product
        }

    } catch (error) {
        return next(error)
    }
    
}

//ANCHOR - Check Product Exist
export async function check_product(req: Request, res: Response, next: NextFunction) {
    try {
        const {nama_produk, id_bagian} = req.query

        const decodedNamaProduk = decodeURIComponent(nama_produk as string)

        const product = await adminProduct.check_product({namaProduk: decodedNamaProduk as string, idBagian: id_bagian as string})


        if ('count' in product!) {
            console.log({count: product.count, data: {nama_produk, id_bagian}})
            if (product.count! > 0) {
                return res.status(200).json({
                    message: "exist",
                    status: "success"
                });
            }else{
                return res.status(200).json({
                    message: "not exist",
                    status: "success"
                });
            }
        } else {
            throw product
        }

    } catch (error) {
        return next(error)
    }
    
}

//ANCHOR - Delete Product
export async function delete_product(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params

        const product = await adminProduct.delete_product(Number(id))

        if ('data' in product!) {
            return res.status(200).json({
                message: "Delete Berhasil",
                status: "success"
            });
        } else {
            throw product
        }

    } catch (error) {
        return next(error)
    }
    
}

//ANCHOR - Edit Product
export async function edit_product(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params
        const {nama_produk, id_bagian, id_kategori, is_active} = req.body

        const decodedNamaProduk = decodeURIComponent(nama_produk as string)

        let putData: {namaProduk: string, idBagian: number, idKategori: number, isActive: boolean} = {
            namaProduk: decodedNamaProduk,
            idBagian: Number(id_bagian),
            idKategori: Number(id_kategori),
            isActive: is_active == "1" ? true : false
        }

        //console.log("data 1", is_active)

        if (nama_produk == "" || id_bagian == "" || id_kategori == "" || is_active == "") {
            return res.status(400).json({
                message: "Data Tidak Boleh Kosong",
                status: "error",
                type: "error"
            });
        }

        const product = await adminProduct.edit_product(Number(id), putData)

        if ('data' in product!) {
            return res.status(200).json({
                message: "Edit Berhasil",
                status: "success"
            });
        } else {
            throw product
        }

    } catch (error) {
        return next(error)
    }
    
}