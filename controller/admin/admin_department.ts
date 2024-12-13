import { NextFunction, Request, Response } from "express";
import * as adminDepartment from "../../services/admin/admin_department_service";

export async function add_department(req: Request, res: Response, next: NextFunction) {
    try {
        let postData = {
            namaBagian: req.body.nama_bagian,
            isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false
        }

        const department = await adminDepartment.add_department_model(postData);

        if ("data" in department!) {
            res.status(200).json({
                data: department.data
            })
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }



}

export async function find_all(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
            limit: req.query.limit == undefined ? undefined : req.query.limit,
            offset: req.query.offset == undefined ? undefined : req.query.offset,
            search: (req.query.search == undefined || req.query.search.length == 0) ? undefined : req.query.search
        }

        //console.log(getData)

        const department = await adminDepartment.find_all_department_model(getData);

        if ("data" in department!) {
            res.status(200).json({
                data: department.data,
                count: department.count
            })
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }

}

export async function detail_department(req: Request, res: Response, next: NextFunction) {
    try {
        let paramData = {
            id: parseInt(req.params.id)
        }

        const department = await adminDepartment.get_detail_department_model(paramData);

        if ("data" in department!) {
            res.status(200).json({
                data: department.data
            })
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }
}

export async function find_department(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            namaBagian: req.query.nama_bagian,
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
        }

        const department = await adminDepartment.find_department_model(getData);

        if ("data" in department!) {
            res.status(200).json({
                data: department.data
            })
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }



}

export async function find_fixed_department(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            namaBagian: req.query.nama_bagian,
        }

        const department = await adminDepartment.find_department_fixed_model(getData);

        if ("data" in department!) {
            if(department.data != null){
                res.status(200).json({
                    message: "exist"
                })
            }else {
                res.status(200).json({
                    message: "not exist"
                })
            }
            
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }



}


export async function update_department(req: Request, res: Response, next: NextFunction) {
    try {
        const postData = {
            id: req.params.id,
            namaBagian: req.body?.nama_bagian == undefined ? undefined : req.body?.nama_bagian,
            isActive: req.body?.is_active == undefined ? undefined : req.body?.is_active === "true" ? true : false

        }

        const department = await adminDepartment.update_department_model(postData)

        if ("data" in department!) {
            res.status(200).json({
                data: department?.data,
                message: "update bagian berhasil"
            })
        } else {
            throw department
        }
    } catch (error) {
        return next(error)
    }


}

export async function hard_delete_department(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const department = await adminDepartment.delete_department_model(paramData);

        if ("data" in department!) {
            res.status(200).json({
                data: department!.data,
                message: "delete department berhasil"
            })
        } else {
            throw department
        }
    } catch (error) {

    }

}