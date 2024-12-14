import { NextFunction, Request, Response } from "express";
import * as usersRB from "../../services/users/users_rb_service";
import { Konfirmasi, Status } from "@prisma/client";

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
            res.status(200).json({
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
            res.status(200).json({
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
            nomor_batch: nomor_batch == undefined ? undefined : nomor_batch == "" ? null : nomor_batch,
            tanggal_kembali: tanggal_kembali == undefined ? undefined : tanggal_kembali == "" ? null : tanggal_kembali
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