import { Request, Response, NextFunction } from "express"
import * as users from "../services/admin/admin_users_service"
import {
    check_product_same_department
} from "../services/users/users_rb_service"

export async function check_is_authorized_admin(req: Request, res: Response, next: NextFunction) {
    const data: { id: number } = { id: res.locals.userinfo.id }
    const getAdmin = await users.find_user_by_id(data)

    if (getAdmin == null) {
        return res.status(403).json({
            code: "A001",
            message: "Hacker"
        })
    }

    if ("data" in getAdmin) {
        if (getAdmin.data?.isAdmin == true) {
            return next()
        } else {
            return res.status(403).json({
                type: "error",
                code: "A001",
                message: "Akses Dilarang: Khusus Admin"
            })
        }
    }

    return res.status(204)
}

export async function check_user_has_department(req: Request, res: Response, next: NextFunction) {
    const data: { id: number } = { id: res.locals.userinfo.id }
    const getIdDepartment = await users.get_department_user_by_id(data)

    if (getIdDepartment == null) {
        return res.status(403).json({
            type: "error",
            code: "A001",
            message: "Belum ada bagian. Hubungi Admin untuk didaftarkan!"
        }) 
    }

    if ("data" in getIdDepartment!) {
        if (getIdDepartment.data!.idBagian) {
            return next()
        }
    }

    return res.status(204)
}

export async function get_user_department(req: Request, res: Response, next: NextFunction) {
    const data: { idBagian: number | undefined } = { idBagian: res.locals.userinfo.bagian_jabatan[0]?.id_bagian }

    if (data.idBagian == undefined) {
        return res.status(403).json({
            type: "error",
            code: "A001",
            message: "Belum ada bagian. Hubungi Admin untuk didaftarkan!"
        }) 
    }else{
        res.locals.idBagian = data.idBagian
        return next()
    }
}

export async function check_user_same_department(req: Request, res: Response, next: NextFunction) {
    const idProduk = Number(req.params.id)
    const idBagian = res.locals.idBagian
    const checkBagianProduct = await check_product_same_department(idProduk, idBagian)
    // console.log(checkBagianProduct)
    if (!checkBagianProduct) {
        return res.status(403).json({
            type: "error",
            code: "A001",
            message: "Bukan Produk Bagian Anda"
        }) 
    }

    return next()
}