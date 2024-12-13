import { NextFunction, Request, Response } from "express";
import * as adminDepartmentEmployment from "../../services/admin/admin_department_employment_service";
import { handling_error } from "../../helper/errors/handling_error";

//ANCHOR - Menambahkan Bagian VS Jabatan
export async function add_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        let postData = {
            idBagian: req.body.id_bagian,
            idJabatan: req.body.id_jabatan
        }

        const departmentEmployment = await adminDepartmentEmployment.add_department_employment_model(postData);

        if ("error" in departmentEmployment!) {
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!) {
            return res.status(200).json({
                data: departmentEmployment!.data
            })
        }

    } catch (error) {
        return next(error)
    }
}

//ANCHOR - Menampilkan semua Bagian VS Jabatan
export async function find_all(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
            limit: req.query.limit == undefined ? undefined : req.query.limit,
            offset: req.query.offset == undefined ? undefined : req.query.offset
        }

        const departmentEmployment = await adminDepartmentEmployment.find_all_department_employment_model(getData);

        if ("error" in departmentEmployment!) {
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!) {
            return res.status(200).json({
                data: departmentEmployment!.data,
                count: departmentEmployment.count
            })
        }

    } catch (error) {
        return next(error)
    }

}

//ANCHOR - Mencari Bagian | Jabatan
export async function find_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            namaBagian: req.query.nama_bagian == undefined ? undefined : req.query.nama_bagian,
            namaJabatan: req.query.nama_jabatan == undefined ? undefined : req.query.nama_jabatan,
        }

        //console.log(getData)

        const departmentEmployment = await adminDepartmentEmployment.find_department_employment_model(getData);

        if ("error" in departmentEmployment!) {
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!) {
            return res.status(200).json({
                data: departmentEmployment!.data,
                count: departmentEmployment.count
            })
        }

    } catch (error) {
        return next(error)
    }

}

//ANCHOR - Menampilkan detail Bagian VS Jabatan
export async function detail_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const departmentEmployment = await adminDepartmentEmployment.get_detail_department_employment_model(paramData);

        if ("error" in departmentEmployment!) {
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!) {
            return res.status(200).json({
                data: departmentEmployment!.data
            })
        }
        
    } catch (error) {
        return next(error)
    }

}

//ANCHOR - Mencari Jabatan berdasarkan bagian
export async function find_bagian_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            idBagian: parseInt(req.params.id),
        }

        const departmentEmployment = await adminDepartmentEmployment.find_bagian_department_employment_model(getData);

        if ("error" in departmentEmployment!){
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!){
            return res.status(200).json({
                data: departmentEmployment!.data
            })
        }

    } catch (error) {
        return next(error)
    }

}

//ANCHOR - update Bagian VS Jabatan
export async function update_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const id_bagian: string | number | undefined = req.body.id_bagian
        const id_jabatan: string | number | undefined = req.body.id_jabatan

        const postData = {
            id: parseInt(req.params.id),
            idBagian: id_bagian == undefined ? undefined : parseInt(req.body.id_bagian),
            idJabatan: id_jabatan == undefined ? undefined : parseInt(req.body.id_jabatan)
        }

        const departmentEmployment = await adminDepartmentEmployment.update_department_employment_model(postData);

        if ("error" in departmentEmployment!){
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!){
            return res.status(200).json({
                data: departmentEmployment!.data
            })
        }

    } catch (error) {
        return next(error)
    }

}

//ANCHOR - delete Bagian VS Jabatan
export async function hard_delete_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id),
        }

        if (isNaN(paramData.id)) {
            return res.status(400).json({ ...handling_error(null, { message: "id bukan sebuah angka" }) })
        }

        const departmentEmployment = await adminDepartmentEmployment.delete_department_employment_model(paramData);

        if ("error" in departmentEmployment!){
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!){
            return res.status(200).json({
                data: departmentEmployment!.data
            })
        }
        
    } catch (error) {
        return next(error)
    }

}

//ANCHOR - Mencari Bagian Jabatan
export async function find_fixed_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            idBagian: req.query.id_bagian == undefined ? undefined : req.query.id_bagian,
            idJabatan: req.query.id_jabatan == undefined ? undefined : req.query.id_jabatan
        }

        if ((getData.idBagian == undefined || getData.idBagian == "") && (getData.idJabatan == undefined || getData.idJabatan == "")){
            return res.status(200).json({
                message: "not applicable"
            })
        }

        const departmentEmployment = await adminDepartmentEmployment.find_fixed_department_employment_model(getData);

        if ("error" in departmentEmployment!){
            throw departmentEmployment
        }

        if ("data" in departmentEmployment!){
            if(departmentEmployment.data == null){
                return res.status(200).json({
                    message: "not exist"
                })
            }

            return res.status(200).json({
                message: "exist"
            })
        }

    } catch (error) {
        return next(error)
    }

}