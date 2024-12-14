import { NextFunction, Request, Response } from "express";
import * as adminProduct from "../../services/admin/admin_product_service";
import * as adminProductRB from "../../services/admin/admin_product_rb_service";

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
        const data = {
            limit: req.query.limit == undefined ? null : Number(req.query.limit),
            offset: req.query.offset == undefined ? null : Number(req.query.offset),
            search_kategori: req.query.search_kategori == undefined ? null : String(req.query.search_kategori)
        }
        const kategori = await adminProduct.get_kategori(data)

        if ('data' in kategori! && 'count' in kategori!) {
            res.status(200).json({
                data: kategori.data,
                message: "Data Kategori",
                count: kategori.count,
                status: "success"
            });
        } else {
            throw kategori
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Check Kategori
export async function check_kategori(req: Request, res: Response, next: NextFunction) {
    try {
        const {nama_kategori} = req.query

        const decodedNamaKategori = decodeURIComponent(nama_kategori as string)

        const kategori = await adminProductRB.check_category({namaKategori: decodedNamaKategori as string})

        if ('data' in kategori!) {
            if (kategori.data! > 0) {
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
            throw kategori
        }

    } catch (error) {
        return next(error)
    }
    
}

//ANCHOR - Tambah Kategori
export async function add_category(req: Request, res: Response, next: NextFunction) {
    try {
        let postData: kategori = {
            namaKategori: String(req.body.nama_kategori),
            startingNumber: String(req.body.starting_number)
        }

        if (postData.startingNumber?.match(/\d{6}/) == null) {
            throw new Error("Starting Number Harus 6 digit")
        }

        const category = await adminProductRB.add_category(postData)

        if ('data' in category!) {
            res.status(200).json({
                data: category.data,
                message: "Tambah Kategori Berhasil",
                status: "success"
            });
        } else {
            throw category
        }
    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Update Kategori
export async function update_kategori(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params
        const {nama_kategori, starting_number} = req.body

        const decodedNamaKategori = decodeURIComponent(nama_kategori as string)

        const putData: {namaKategori: string, startingNumber: string} = {
            namaKategori: decodedNamaKategori,
            startingNumber: starting_number
        }

        if (nama_kategori == "") {
            return res.status(400).json({
                message: "Data Tidak Boleh Kosong",
                status: "error",
                type: "error"
            });
        }

        if (starting_number == "") {
            return res.status(400).json({
                message: "Data Tidak Boleh Kosong",
                status: "error",
                type: "error"
            });
        }

        const kategori = await adminProductRB.update_kategori(Number(id), putData)

        if ('data' in kategori!) {
            return res.status(200).json({
                message: "Update Berhasil",
                status: "success"
            });
        } else {
            throw kategori
        }

    } catch (error) {
        return next(error)
    }
    
}

//ANCHOR - Delete Kategori
export async function delete_category(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params

        const kategori = await adminProductRB.delete_kategori(Number(id))

        if ('data' in kategori!) {
            return res.status(200).json({
                message: "Delete Berhasil",
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