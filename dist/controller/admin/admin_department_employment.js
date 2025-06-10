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
exports.add_department_employment = add_department_employment;
exports.find_all = find_all;
exports.find_department_employment = find_department_employment;
exports.detail_department_employment = detail_department_employment;
exports.find_bagian_department_employment = find_bagian_department_employment;
exports.update_department_employment = update_department_employment;
exports.hard_delete_department_employment = hard_delete_department_employment;
exports.find_fixed_department_employment = find_fixed_department_employment;
const adminDepartmentEmployment = __importStar(require("../../services/admin/admin_department_employment_service"));
const handling_error_1 = require("../../helper/errors/handling_error");
//ANCHOR - Menambahkan Bagian VS Jabatan
function add_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postData = {
                idBagian: req.body.id_bagian,
                idJabatan: req.body.id_jabatan
            };
            const departmentEmployment = yield adminDepartmentEmployment.add_department_employment_model(postData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Menampilkan semua Bagian VS Jabatan
function find_all(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
                limit: req.query.limit == undefined ? undefined : req.query.limit,
                offset: req.query.offset == undefined ? undefined : req.query.offset
            };
            const departmentEmployment = yield adminDepartmentEmployment.find_all_department_employment_model(getData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data,
                    count: departmentEmployment.count
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Mencari Bagian | Jabatan
function find_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                namaBagian: req.query.nama_bagian == undefined ? undefined : req.query.nama_bagian,
                namaJabatan: req.query.nama_jabatan == undefined ? undefined : req.query.nama_jabatan,
            };
            //console.log(getData)
            const departmentEmployment = yield adminDepartmentEmployment.find_department_employment_model(getData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data,
                    count: departmentEmployment.count
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Menampilkan detail Bagian VS Jabatan
function detail_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const departmentEmployment = yield adminDepartmentEmployment.get_detail_department_employment_model(paramData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Mencari Jabatan berdasarkan bagian
function find_bagian_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                idBagian: parseInt(req.params.id),
            };
            const departmentEmployment = yield adminDepartmentEmployment.find_bagian_department_employment_model(getData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - update Bagian VS Jabatan
function update_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_bagian = req.body.id_bagian;
            const id_jabatan = req.body.id_jabatan;
            const postData = {
                id: parseInt(req.params.id),
                idBagian: id_bagian == undefined ? undefined : parseInt(req.body.id_bagian),
                idJabatan: id_jabatan == undefined ? undefined : parseInt(req.body.id_jabatan)
            };
            const departmentEmployment = yield adminDepartmentEmployment.update_department_employment_model(postData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - delete Bagian VS Jabatan
function hard_delete_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id),
            };
            if (isNaN(paramData.id)) {
                return res.status(400).json(Object.assign({}, (0, handling_error_1.handling_error)(null, { message: "id bukan sebuah angka" })));
            }
            const departmentEmployment = yield adminDepartmentEmployment.delete_department_employment_model(paramData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                return res.status(200).json({
                    data: departmentEmployment.data
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
//ANCHOR - Mencari Bagian Jabatan
function find_fixed_department_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let getData = {
                idBagian: req.query.id_bagian == undefined ? undefined : req.query.id_bagian,
                idJabatan: req.query.id_jabatan == undefined ? undefined : req.query.id_jabatan
            };
            if ((getData.idBagian == undefined || getData.idBagian == "") && (getData.idJabatan == undefined || getData.idJabatan == "")) {
                return res.status(200).json({
                    message: "not applicable"
                });
            }
            const departmentEmployment = yield adminDepartmentEmployment.find_fixed_department_employment_model(getData);
            if ("error" in departmentEmployment) {
                throw departmentEmployment;
            }
            if ("data" in departmentEmployment) {
                if (departmentEmployment.data == null) {
                    return res.status(200).json({
                        message: "not exist"
                    });
                }
                return res.status(200).json({
                    message: "exist"
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
}
