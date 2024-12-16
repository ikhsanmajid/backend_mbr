import express, { NextFunction, Request, Response } from "express";
import * as adminEmployment from "../../services/admin/admin_employment_service";
import { count, error } from "console";

export async function add_employment(req: Request, res: Response, next: NextFunction) {
    try {
        let postData = {
            namaJabatan: req.body.nama_jabatan,
            isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false
        }

        const employment = await adminEmployment.add_employment_model(postData);

        if ("data" in employment!) {
            res.status(200).json({
                data: employment.data
            })
        } else {
            throw employment
        }
    } catch (error) {
        next(error)
    }
}

export async function find_all(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
            limit: req.query.limit == undefined ? undefined : req.query.limit,
            offset: req.query.offset == undefined ? undefined : req.query.offset
        }
        const employment = await adminEmployment.find_all_employment_model(getData);

        if ("data" in employment!) {
            res.status(200).json({
                data: employment.data,
                count: employment.count
            })
        } else {
            throw employment
        }
    } catch (error) {
        next(error)
    }
}

export async function find_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            namaBagian: req.query.nama_jabatan,
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
        }

        const employment = await adminEmployment.find_employment_model(getData);

        if ("data" in employment!) {
            res.status(200).json({
                data: employment.data
            })
        } else {
            throw error
        }
    } catch (error) {
        next(error)
    }

}

export async function find_fixed_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            namaJabatan: req.query.nama_jabatan,
        }

        const employment = await adminEmployment.find_employment_fixed_model(getData);

        if ("data" in employment!) {
            if(employment.data != null){
                res.status(200).json({
                    message: "exist"
                })
            }else {
                res.status(200).json({
                    message: "not exist"
                })
            }
            
        } else {
            throw employment
        }
    } catch (error) {
        return next(error)
    }
}

export async function detail_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const employment = await adminEmployment.get_detail_employment_model(paramData);

        if ("data" in employment!) {
            res.status(200).json({
                data: employment.data
            })
        } else {
            throw error
        }
    } catch (error) {
        next(error)
    }

}

export async function update_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const postData = {
            id: req.params.id,
            namaJabatan: req.body?.nama_jabatan == undefined ? undefined : req.body?.nama_jabatan,
            isActive: req.body?.is_active == undefined ? undefined : req.body?.is_active === "true" ? true : false

        }

        //console.log(postData)

        const employment = await adminEmployment.update_employment_model(postData)

        if ("data" in employment!) {
            res.status(200).json({
                data: employment?.data,
                message: "update jabatan berhasil"
            })
        } else {
            throw error
        }
    } catch (error) {
        next(error)
    }
}

export async function hard_delete_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const employment = await adminEmployment.delete_employment_model(paramData);

        if ("data" in employment!) {
            res.status(200).json({
                data: employment!.data,
                message: "delete jabatan berhasil"
            })
        } else {
            throw error
        }
    } catch (error) {
        next(error)
    }

}