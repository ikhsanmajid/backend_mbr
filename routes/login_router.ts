import express, { Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import * as authentication from "../middleware/authentication"
import * as authorization from "../middleware/authorization"
import BadRequestError from "../helper/errors/BadRequestError";
import { errorHandler } from "../middleware/handlingError";

passport.use(authentication.local)

const login: Router = express.Router()

login.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.email == undefined || req.body.email == "" || req.body.password == undefined || req.body.password == "") throw new BadRequestError({ message: "Empty Field", context: { code: 422, message: "Field Input Kosong" } })

        passport.authenticate('local', { session: false }, (err: any, user: object) => {
            try {
                if (user) {
                    res.locals.access_token = user
                    return next()
                } else {
                    throw new BadRequestError({ message: err.message, context: { code: err.code } })
                }
            } catch (err) {
                return next(err)
            }
        })(req, res, next)
    } catch (err) {
        next(err)
    }

}, function (req: Request, res: Response) {
    return res.json({
        data: res.locals.access_token
    })
})

login.get("/check", authentication.check_access_token, authorization.check_is_authorized_admin, (req: Request, res: Response) => {
    res.json({
        user: res.locals.userinfo,
        status: "authenticated"
    })
})

login.use(errorHandler);


export default login;