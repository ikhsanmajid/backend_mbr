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
exports.add_department = add_department;
exports.find_all = find_all;
exports.detail_department = detail_department;
exports.find_department = find_department;
exports.find_fixed_department = find_fixed_department;
exports.update_department = update_department;
exports.hard_delete_department = hard_delete_department;
const adminDepartment = __importStar(require("../../services/admin/admin_department_service"));
function add_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postData = {
                namaBagian: req.body.nama_bagian,
                isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false,
                kategori: req.body.kategori == undefined ? undefined : Number(req.body.kategori),
            };
            const department = yield adminDepartment.add_department_model(postData);
            if ("data" in department) {
                res.status(200).json({
                    data: department.data
                });
            }
            else {
                throw department;
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
            let getData = {
                isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
                manufaktur: req.query.manufaktur == undefined ? undefined : req.query.manufaktur === "yes" ? true : false,
                limit: req.query.limit == undefined ? undefined : req.query.limit,
                offset: req.query.offset == undefined ? undefined : req.query.offset,
                search: (req.query.search == undefined || req.query.search.length == 0) ? undefined : req.query.search
            };
            //console.log(getData)
            const department = yield adminDepartment.find_all_department_model(getData);
            if ("data" in department) {
                res.status(200).json({
                    data: department.data,
                    count: department.count
                });
            }
            else {
                throw department;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function detail_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let paramData = {
                id: parseInt(req.params.id)
            };
            const department = yield adminDepartment.get_detail_department_model(paramData);
            if ("data" in department) {
                res.status(200).json({
                    data: department.data
                });
            }
            else {
                throw department;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function find_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                namaBagian: req.query.nama_bagian,
                isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
            };
            const department = yield adminDepartment.find_department_model(getData);
            if ("data" in department) {
                res.status(200).json({
                    data: department.data
                });
            }
            else {
                throw department;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function find_fixed_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                namaBagian: req.query.nama_bagian,
            };
            const department = yield adminDepartment.find_department_fixed_model(getData);
            if ("data" in department) {
                if (department.data != null) {
                    res.status(200).json({
                        message: "exist"
                    });
                }
                else {
                    res.status(200).json({
                        message: "not exist"
                    });
                }
            }
            else {
                throw department;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function update_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const postData = {
                id: req.params.id,
                namaBagian: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.nama_bagian) == undefined ? undefined : (_b = req.body) === null || _b === void 0 ? void 0 : _b.nama_bagian,
                isActive: ((_c = req.body) === null || _c === void 0 ? void 0 : _c.is_active) == undefined ? undefined : ((_d = req.body) === null || _d === void 0 ? void 0 : _d.is_active) === "true" ? true : false,
                kategori: ((_e = req.body) === null || _e === void 0 ? void 0 : _e.kategori) == undefined ? undefined : Number((_f = req.body) === null || _f === void 0 ? void 0 : _f.kategori)
            };
            const department = yield adminDepartment.update_department_model(postData);
            if ("data" in department) {
                res.status(200).json({
                    data: department === null || department === void 0 ? void 0 : department.data,
                    message: "update bagian berhasil"
                });
            }
            else {
                throw department;
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
function hard_delete_department(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const department = yield adminDepartment.delete_department_model(paramData);
            if ("data" in department) {
                res.status(200).json({
                    data: department.data,
                    message: "delete department berhasil"
                });
            }
            else {
                throw department;
            }
        }
        catch (error) {
        }
    });
}
