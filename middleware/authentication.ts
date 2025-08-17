import { NextFunction, Request, Response } from "express";
import { Strategy as LocalStrategy } from "passport-local"
import * as bcrypt from "bcrypt"
import * as jsonwebtoken from "jsonwebtoken";
import * as login_service from "../services/login_service"
import BadRequestError from "../helper/errors/BadRequestError";

const jwt = jsonwebtoken

async function generate_access_token(userinfo: any) {
    const access_token = await jwt.sign(userinfo, process.env.TOKEN_SECRET!, { expiresIn: '7h' })
    //console.log(access_token)
    return access_token
}

export const local = new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {
        let login: any = await login_service.find_one(email)

        const data = login.data

        if (data.login == null) return done({ code: "L001", message: "User Tidak Ditemukan" }, false)

        if (!data.login.email) return done({ code: "L001", message: "User Tidak Ditemukan" }, false)

        if (!bcrypt.compareSync(password, data.login.password)) return done({ code: "L002", message: "Password Salah" }, false)

        if (!data.login.isActive === true) return done({ code: "L003", message: "User Tidak Aktif" }, false)

        if (data.detail.length == 0) return done({ code: "L004", message: "Bagian Jabatan Belum Diset" }, false)

        const formatted_detail: any = data.detail.map((item: any) => {
            return {
                id_bagian: item.idBagianJabatanFK.idBagianFK.id,
                nama_bagian: item.idBagianJabatanFK.idBagianFK.namaBagian,
                id_jabatan: item.idBagianJabatanFK.idJabatanFK.id,
                nama_jabatan: item.idBagianJabatanFK.idJabatanFK.namaJabatan,
            }
        })

        const access_token_data = {
            ...data.login,
            bagian_jabatan: formatted_detail
        }

        const access_token = await generate_access_token(access_token_data)

        const result = {
            access_token: access_token,
            detail: jwt.decode(access_token) as any
        }

        return done(null, result)

    } catch (e) {

        return done({ code: "L999", message: "Backend Error", stack: e }, false)
    }
})

export const check_access_token = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'] as string
        let token: string
        token = authHeader && authHeader.split(' ')[1]

        if (token == null) throw new BadRequestError({ message: "Token Tidak Ditemukan", context: { code: "A003", message: "Token Tidak Ditemukan" } })

        jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {

            if (err) {
                let code: string;
                let message: string;

                if (err.message == "jwt expired") {
                    throw new BadRequestError({ statusCode: 401, message: "Token Expired", context: { code: "A002", message: "Token Kadaluarsa" } })
                } else {
                    throw new BadRequestError({ message: "Another Issue", context: { code: "A999", message: "Unexpected Token Issue" } })
                }

            }

            res.locals.userinfo = user
            return next()

        })
    } catch (e) {
        next(e)
    }
}
