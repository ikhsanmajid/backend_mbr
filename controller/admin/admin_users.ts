import { NextFunction, Request, Response } from "express";
import * as adminUsers from "../../services/admin/admin_users_service";
import * as bcrypt from "bcrypt"

// Variabel POST = postData GET = getData

export async function add_user(req: Request, res: Response, next: NextFunction) {
    async function hash_password(password: string): Promise<string> {
        const hashed = await bcrypt.hash(password, 10)
        return hashed
    }

    try {
        let postData = {
            nik: req.body.nik,
            email: req.body.email,
            nama: req.body.nama,
            password: await hash_password(req.body.password),
            isAdmin: false,
            isActive: false,
            dateCreated: new Date().toISOString()
        }

        const user = await adminUsers.add_user_model(postData)

        if ('data' in user!) {
            res.status(200).json({
                data: user.data,
                message: "Tambah User Berhasil",
                status: "success"
            });
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }


}

export async function check_email(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            email: req.query.email,
        }

        const user = await adminUsers.check_email_model(getData)

        if ('data' in user!) {
            if (user.data !== null) {
                res.status(200).json({
                    message: "exist",
                });
            } else {
                res.status(200).json({
                    message: "not exist"
                })
            }

        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }
}

export async function check_nik(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            nik: req.query.nik,
        }

        const user = await adminUsers.check_nik_model(getData)

        if ('data' in user!) {
            if (user.data !== null) {
                res.status(200).json({
                    message: "exist",
                });
            } else {
                res.status(200).json({
                    message: "not exist"
                })
            }

        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }
}

export async function find_all(req: Request, res: Response, next: NextFunction) {
    try {
        const getData = {
            isActive: req.query.is_active == undefined ? null : req.query.is_active == "true" ? true : false,
            limit: req.query.limit == undefined ? null : req.query.limit,
            offset: req.query.offset == undefined ? null : req.query.offset,
            search_user: req.query.search_user == undefined ? null : req.query.search_user,
            active: req.query.active == undefined ? null : req.query.active
        }

        const user = await adminUsers.find_all_users_model(getData);

        if ("data" in user!) {
            if (user.data)
                res.status(200).json({
                    data: user!.data,
                    count: user!.count,
                    status: "success"
                })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }
}


export async function find_user(req: Request, res: Response, next: NextFunction) {
    try {
        let getData = {
            email: req.query.email,
        }

        const user = await adminUsers.find_user_model(getData);

        if ("data" in user!) {
            res.status(200).json({
                data: user!.data,
                status: "success"
            })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }

}

export async function detail_user(req: Request, res: Response, next: NextFunction) {
    try {

        let getData = {
            id: parseInt(req.params.id)
        }

        const user = await adminUsers.get_detail_user_model(getData);

        let responseData = {}

        if ("data" in user!) {
            let bagianjabatan: { idBagianJabatan: any, idBagianJabatanKey: any, bagianJabatan: { bagian: any; jabatan: any; } }[] = []

            user.data?.jabatanBagian.map((item: any) => {
                bagianjabatan.push({
                    idBagianJabatan: item.id,
                    idBagianJabatanKey: item.idBagianJabatan,
                    bagianJabatan: {
                        bagian: item.idBagianJabatanFK.idBagianFK,
                        jabatan: item.idBagianJabatanFK.idJabatanFK,
                    }
                })
            })

            responseData = {
                id: user.data?.id,
                email: user.data?.email,
                nik: user.data?.nik,
                nama: user.data?.nama,
                isActive: user.data?.isActive,
                isAdmin: user.data?.isAdmin,
                bagianjabatan: bagianjabatan
            }

            res.status(200).json({
                data: responseData,
                status: "success"
            })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }

}

export async function update_user(req: Request, res: Response, next: NextFunction) {
    async function hash_password(password: string): Promise<string | null> {
        if (password == "") {
            return null
        }

        const hashed = await bcrypt.hash(password, 10)
        return hashed
    }

    try {
        
        const postData = {
            id: req.params.id,
            nik: req.body?.nik == undefined ? undefined : req.body?.nik,
            nama: req.body?.nama == undefined ? undefined : req.body?.nama,
            email: req.body?.email == undefined ? undefined : req.body?.email,
            password: req.body?.password == undefined ? undefined : await hash_password(req.body?.password),
            isAdmin: req.body?.is_admin == undefined ? undefined : req.body?.is_admin == "true" ? true : false,
            isActive: req.body?.is_active == undefined ? undefined : req.body?.is_active == "true" ? true : false,
        }


        const user = await adminUsers.update_user_model(postData);

        if ("data" in user!) {
            res.status(200).json({
                data: user!.data,
                message: "update user berhasil",
                status: "success"
            })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }
}

export async function hard_delete_user(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const user = await adminUsers.delete_users_model(paramData);

        if ("data" in user!) {
            res.status(200).json({
                data: user!.data,
                message: "delete user berhasil",
                status: "success"
            })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }

}

export async function delete_user_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        }

        const deleteProcess = await adminUsers.delete_user_department_model(paramData)

        if ("data" in deleteProcess!) {
            res.status(200).json({
                data: deleteProcess!.data,
                message: "delete jabatan berhasil",
                status: "success"
            })
        } else {
            throw deleteProcess
        }

    } catch (error) {
        next(error)
    }
}

export async function update_user_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const postData = {
            id: parseInt(req.body.id),
            idBagianJabatan: parseInt(req.body.idBagianJabatan)
        }

        const updateProcess = await adminUsers.update_user_department_model(postData)

        if ("data" in updateProcess!) {
            return res.status(200).json({
                data: updateProcess!.data,
                message: "update jabatan berhasil",
                status: "success"
            })
        } else {
            throw updateProcess
        }

    } catch (error) {
        next(error)
    }
}

export async function add_user_department_employment(req: Request, res: Response, next: NextFunction) {
    try {
        const postData = {
            idUser: parseInt(req.body.idUser),
            idBagianJabatan: parseInt(req.body.idBagianJabatan)
        }
        //console.log(postData)
        const addProcess = await adminUsers.add_user_department_model(postData)


        if ("data" in addProcess!) {
            return res.status(200).json({
                data: addProcess!.data,
                message: "Tambah Jabatan Berhasil",
                status: "success"
            })
        } else {
            throw addProcess
        }

    } catch (error) {
        next(error)
    }
}

export async function update_password(req: Request, res: Response, next: NextFunction) {
    async function hash_password(password: string): Promise<string> {
        const hashed = await bcrypt.hash(password, 10)
        return hashed
    }

    try {
        //console.log(res.locals)
        
        // const postData = {
        //     id: Number(req.params.id),
        //     password: req.body?.password == undefined ? undefined : req.body?.password,
        //     confirm_password: req.body?.confirm_password == undefined ? undefined : req.body?.confirm_password,
        // }

        const id = Number(req.params.id)
        const password = req.body?.password
        const confirm_password = req.body?.confirm_password

        console.log(id, password, confirm_password)

        if (res.locals.idUser != id) {
            return res.status(400).json({
                message: "Tidak bisa mengubah password user lain",
                status: "error"
            })
        }

        if (password.length < 8 && confirm_password.length < 8) {
            return res.status(400).json({
                message: "Password minimal 8 karakter",
                status: "error"
            })
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Password tidak sama",
                status: "error"
            })
        }

        if (!password.match(".*[0-9].*") && !confirm_password.match(".*[0-9].*")) {
            return res.status(400).json({
                message: "Password minimal terdapat 1 angka",
                status: "error"
            })
        }

        // Jika password tidak terdapat simbol
        if (!password.match(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*") && !confirm_password.match(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            return res.status(400).json({
                message: "Password minimal terdapat 1 simbol",
                status: "error"
            })
        }

        // Jika password tidak terdapat huruf kapital
        if (!password.match(".*[A-Z].*") && !confirm_password.match(".*[A-Z].*")) {
            return res.status(400).json({
                message: "Password minimal terdapat 1 huruf kapital",
                status: "error"
            })
        }

        const hashedPassword = await hash_password(password)


        const user = await adminUsers.update_user_password_model(id, hashedPassword);

        if ("data" in user!) {
            res.status(200).json({
                data: user!.data,
                message: "update password berhasil",
                status: "success"
            })
        } else {
            throw user
        }
    } catch (error) {
        return next(error)
    }
}