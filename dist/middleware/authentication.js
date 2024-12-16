"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_access_token = exports.local = void 0;
const passport_local_1 = require("passport-local");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken = __importStar(require("jsonwebtoken"));
const login_service = __importStar(require("../services/login_service"));
const BadRequestError_1 = __importDefault(require("../helper/errors/BadRequestError"));
const jwt = jsonwebtoken;
function generate_access_token(userinfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const access_token = yield jwt.sign(userinfo, process.env.TOKEN_SECRET, { expiresIn: '2h' });
        //console.log(access_token)
        return access_token;
    });
}
exports.local = new passport_local_1.Strategy({ usernameField: "email" }, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let login = yield login_service.find_one(email);
            const data = login.data;
            if (data.login == null)
                return done({ code: "L001", message: "User Tidak Ditemukan" }, false);
            if (data.login.email) {
                if (bcrypt.compareSync(password, data.login.password)) {
                    if (data.login.isActive === true) {
                        //console.log(detail)
                        const formatted_detail = data.detail.map((item) => {
                            return {
                                id_bagian: item.idBagianJabatanFK.idBagianFK.id,
                                nama_bagian: item.idBagianJabatanFK.idBagianFK.namaBagian,
                                id_jabatan: item.idBagianJabatanFK.idJabatanFK.id,
                                nama_jabatan: item.idBagianJabatanFK.idJabatanFK.namaJabatan,
                            };
                        });
                        const access_token_data = Object.assign(Object.assign({}, data.login), { bagian_jabatan: formatted_detail });
                        const access_token = yield generate_access_token(access_token_data);
                        //console.log(await jwt.verify(access_token, process.env.TOKEN_SECRET as string))
                        const result = {
                            access_token: access_token,
                            detail: jwt.decode(access_token)
                            // detail: {
                            //     id: data.login.id,
                            //     nama: data.login.nama,
                            //     email: data.login.email,
                            //     is_admin: data.login.isAdmin,
                            //     is_active: data.login.isActive,
                            //     bagian_jabatan: formatted_detail
                            // },
                            // expires_at: jwt.decode(access_token) as any
                        };
                        //console.log(result)
                        return done(null, result);
                    }
                    else {
                        return done({ code: "L003", message: "User Tidak Aktif" }, false);
                    }
                }
                else {
                    return done({ code: "L002", message: "Password Salah" }, false);
                }
            }
            else {
                //console.log(login)
                return done({ code: "L001", message: "User Tidak Ditemukan" }, false);
            }
        }
        catch (e) {
            //console.log(e)
            return done({ code: "L999", message: "Backend Error", stack: e }, false);
        }
    });
});
const check_access_token = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        let token;
        token = authHeader && authHeader.split(' ')[1];
        // if (authHeader != undefined || authHeader != null || authHeader != ""){
        //     token = authHeader && authHeader.split(' ')[1]
        // }
        // token = req?.cookies.access_token
        // console.log(req?.cookies)
        if (token == null)
            throw new BadRequestError_1.default({ message: "Token Tidak Ditemukan", context: { code: "A003", message: "Token Tidak Ditemukan" } });
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                let code;
                let message;
                if (err.message == "jwt expired") {
                    throw new BadRequestError_1.default({ message: "Token Expired", context: { code: "A002", message: "Token Kadaluarsa" } });
                }
                else {
                    throw new BadRequestError_1.default({ message: "Another Issue", context: { code: "A999", message: "Unexpected Token Issue" } });
                }
            }
            else {
                res.locals.userinfo = user;
                return next();
            }
        });
    }
    catch (e) {
        next(e);
    }
};
exports.check_access_token = check_access_token;
