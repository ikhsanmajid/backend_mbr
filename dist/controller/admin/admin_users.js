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
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_user = add_user;
exports.check_email = check_email;
exports.check_nik = check_nik;
exports.find_all = find_all;
exports.find_user = find_user;
exports.detail_user = detail_user;
exports.update_user = update_user;
exports.hard_delete_user = hard_delete_user;
exports.delete_user_department_employment = delete_user_department_employment;
exports.update_user_department_employment = update_user_department_employment;
exports.add_user_department_employment = add_user_department_employment;
const adminUsers = __importStar(require("../../services/admin/admin_users_service"));
const bcrypt = __importStar(require("bcrypt"));
// Variabel POST = postData GET = getData
function add_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        function hash_password(password) {
            return __awaiter(this, void 0, void 0, function* () {
                const hashed = yield bcrypt.hash(password, 10);
                return hashed;
            });
        }
        try {
            let postData = {
                nik: req.body.nik,
                email: req.body.email,
                nama: req.body.nama,
                password: yield hash_password(req.body.password),
                isAdmin: false,
                isActive: true,
                dateCreated: new Date().toISOString()
            };
            const user = yield adminUsers.add_user_model(postData);
            if ('data' in user) {
                res.status(200).json({
                    data: user.data,
                    message: "Tambah User Berhasil",
                    status: "success"
                });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function check_email(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                email: req.query.email,
            };
            const user = yield adminUsers.check_email_model(getData);
            if ('data' in user) {
                if (user.data !== null) {
                    res.status(200).json({
                        message: "exist",
                    });
                }
                else {
                    res.status(200).json({
                        message: "not exist"
                    });
                }
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function check_nik(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                nik: req.query.nik,
            };
            const user = yield adminUsers.check_nik_model(getData);
            if ('data' in user) {
                if (user.data !== null) {
                    res.status(200).json({
                        message: "exist",
                    });
                }
                else {
                    res.status(200).json({
                        message: "not exist"
                    });
                }
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function find_all(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                isActive: req.query.is_active == undefined ? null : req.query.is_active == "true" ? true : false,
                limit: req.query.limit == undefined ? null : req.query.limit,
                offset: req.query.offset == undefined ? null : req.query.offset,
                search_user: req.query.search_user == undefined ? null : req.query.search_user,
                active: req.query.active == undefined ? null : req.query.active
            };
            const user = yield adminUsers.find_all_users_model(getData);
            if ("data" in user) {
                if (user.data)
                    res.status(200).json({
                        data: user.data,
                        count: user.count,
                        status: "success"
                    });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function find_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                email: req.query.email,
            };
            const user = yield adminUsers.find_user_model(getData);
            if ("data" in user) {
                res.status(200).json({
                    data: user.data,
                    status: "success"
                });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function detail_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            let getData = {
                id: parseInt(req.params.id)
            };
            const user = yield adminUsers.get_detail_user_model(getData);
            let responseData = {};
            if ("data" in user) {
                let bagianjabatan = [];
                (_a = user.data) === null || _a === void 0 ? void 0 : _a.jabatanBagian.map((item) => {
                    bagianjabatan.push({
                        idBagianJabatan: item.id,
                        idBagianJabatanKey: item.idBagianJabatan,
                        bagianJabatan: {
                            bagian: item.idBagianJabatanFK.idBagianFK,
                            jabatan: item.idBagianJabatanFK.idJabatanFK,
                        }
                    });
                });
                responseData = {
                    id: (_b = user.data) === null || _b === void 0 ? void 0 : _b.id,
                    email: (_c = user.data) === null || _c === void 0 ? void 0 : _c.email,
                    nik: (_d = user.data) === null || _d === void 0 ? void 0 : _d.nik,
                    nama: (_e = user.data) === null || _e === void 0 ? void 0 : _e.nama,
                    isActive: (_f = user.data) === null || _f === void 0 ? void 0 : _f.isActive,
                    isAdmin: (_g = user.data) === null || _g === void 0 ? void 0 : _g.isAdmin,
                    bagianjabatan: bagianjabatan
                };
                res.status(200).json({
                    data: responseData,
                    status: "success"
                });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function update_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        function hash_password(password) {
            return __awaiter(this, void 0, void 0, function* () {
                if (password == "") {
                    return null;
                }
                const hashed = yield bcrypt.hash(password, 10);
                return hashed;
            });
        }
        try {
            const postData = {
                id: req.params.id,
                nik: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.nik) == undefined ? undefined : (_b = req.body) === null || _b === void 0 ? void 0 : _b.nik,
                nama: ((_c = req.body) === null || _c === void 0 ? void 0 : _c.nama) == undefined ? undefined : (_d = req.body) === null || _d === void 0 ? void 0 : _d.nama,
                email: ((_e = req.body) === null || _e === void 0 ? void 0 : _e.email) == undefined ? undefined : (_f = req.body) === null || _f === void 0 ? void 0 : _f.email,
                password: ((_g = req.body) === null || _g === void 0 ? void 0 : _g.password) == undefined ? undefined : yield hash_password((_h = req.body) === null || _h === void 0 ? void 0 : _h.password),
                isAdmin: ((_j = req.body) === null || _j === void 0 ? void 0 : _j.is_admin) == undefined ? undefined : ((_k = req.body) === null || _k === void 0 ? void 0 : _k.is_admin) == "true" ? true : false,
                isActive: ((_l = req.body) === null || _l === void 0 ? void 0 : _l.is_active) == undefined ? undefined : ((_m = req.body) === null || _m === void 0 ? void 0 : _m.is_active) == "true" ? true : false,
            };
            const user = yield adminUsers.update_user_model(postData);
            if ("data" in user) {
                res.status(200).json({
                    data: user.data,
                    message: "update user berhasil",
                    status: "success"
                });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function hard_delete_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const user = yield adminUsers.delete_users_model(paramData);
            if ("data" in user) {
                res.status(200).json({
                    data: user.data,
                    message: "delete user berhasil",
                    status: "success"
                });
            }
            else {
                throw user;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function delete_user_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const deleteProcess = yield adminUsers.delete_user_department_model(paramData);
            if ("data" in deleteProcess) {
                res.status(200).json({
                    data: deleteProcess.data,
                    message: "delete jabatan berhasil",
                    status: "success"
                });
            }
            else {
                throw deleteProcess;
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function update_user_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postData = {
                id: parseInt(req.body.id),
                idBagianJabatan: parseInt(req.body.idBagianJabatan)
            };
            const updateProcess = yield adminUsers.update_user_department_model(postData);
            if ("data" in updateProcess) {
                return res.status(200).json({
                    data: updateProcess.data,
                    message: "update jabatan berhasil",
                    status: "success"
                });
            }
            else {
                throw updateProcess;
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function add_user_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postData = {
                idUser: parseInt(req.body.idUser),
                idBagianJabatan: parseInt(req.body.idBagianJabatan)
            };
            //console.log(postData)
            const addProcess = yield adminUsers.add_user_department_model(postData);
            if ("data" in addProcess) {
                return res.status(200).json({
                    data: addProcess.data,
                    message: "Tambah Jabatan Berhasil",
                    status: "success"
                });
            }
            else {
                throw addProcess;
            }
        }
        catch (error) {
            next(error);
        }
    });
}
