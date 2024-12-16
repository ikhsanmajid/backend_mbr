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
exports.check_is_authorized_admin = check_is_authorized_admin;
exports.check_user_has_department = check_user_has_department;
exports.get_user_id = get_user_id;
exports.get_user_department = get_user_department;
exports.check_user_same_department = check_user_same_department;
const users = __importStar(require("../services/admin/admin_users_service"));
const users_rb_service_1 = require("../services/users/users_rb_service");
function check_is_authorized_admin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = { id: res.locals.userinfo.id };
        const getAdmin = yield users.find_user_by_id(data);
        if (getAdmin == null) {
            return res.status(403).json({
                code: "A001",
                message: "Hacker"
            });
        }
        if ("data" in getAdmin) {
            if (((_a = getAdmin.data) === null || _a === void 0 ? void 0 : _a.isAdmin) == true) {
                return next();
            }
            else {
                return res.status(403).json({
                    type: "error",
                    code: "A001",
                    message: "Akses Dilarang: Khusus Admin"
                });
            }
        }
        return res.status(204);
    });
}
function check_user_has_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { id: res.locals.userinfo.id };
        const getIdDepartment = yield users.get_department_user_by_id(data);
        if (getIdDepartment == null) {
            return res.status(403).json({
                type: "error",
                code: "A001",
                message: "Belum ada bagian. Hubungi Admin untuk didaftarkan!"
            });
        }
        if ("data" in getIdDepartment) {
            if (getIdDepartment.data.idBagian) {
                return next();
            }
        }
        return res.status(204);
    });
}
function get_user_id(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { idUser: res.locals.userinfo.id };
        if (data.idUser == undefined) {
            return res.status(403).json({
                type: "error",
                code: "A001",
                message: "Belum ada ID. Hubungi Admin untuk didaftarkan!"
            });
        }
        else {
            res.locals.idUser = data.idUser;
            return next();
        }
    });
}
function get_user_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = { idBagian: (_a = res.locals.userinfo.bagian_jabatan[0]) === null || _a === void 0 ? void 0 : _a.id_bagian };
        if (data.idBagian == undefined) {
            return res.status(403).json({
                type: "error",
                code: "A001",
                message: "Belum ada bagian. Hubungi Admin untuk didaftarkan!"
            });
        }
        else {
            res.locals.idBagian = data.idBagian;
            return next();
        }
    });
}
function check_user_same_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idProduk = Number(req.params.id);
        const idBagian = res.locals.idBagian;
        const checkBagianProduct = yield (0, users_rb_service_1.check_product_same_department)(idProduk, idBagian);
        // console.log(checkBagianProduct)
        if (!checkBagianProduct) {
            return res.status(403).json({
                type: "error",
                code: "A001",
                message: "Bukan Produk Bagian Anda"
            });
        }
        return next();
    });
}
