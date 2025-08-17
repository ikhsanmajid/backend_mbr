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
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_employment = add_employment;
exports.find_all = find_all;
exports.find_employment = find_employment;
exports.find_fixed_employment = find_fixed_employment;
exports.detail_employment = detail_employment;
exports.update_employment = update_employment;
exports.hard_delete_employment = hard_delete_employment;
const adminEmployment = __importStar(require("../../services/admin/admin_employment_service"));
const console_1 = require("console");
async function add_employment(req, res, next) {
    try {
        let postData = {
            namaJabatan: req.body.nama_jabatan,
            isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false
        };
        const employment = await adminEmployment.add_employment_model(postData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment.data
            });
        }
        else {
            throw employment;
        }
    }
    catch (error) {
        next(error);
    }
}
async function find_all(req, res, next) {
    try {
        const getData = {
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
            limit: req.query.limit == undefined ? undefined : req.query.limit,
            offset: req.query.offset == undefined ? undefined : req.query.offset
        };
        const employment = await adminEmployment.find_all_employment_model(getData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment.data,
                count: employment.count
            });
        }
        else {
            throw employment;
        }
    }
    catch (error) {
        next(error);
    }
}
async function find_employment(req, res, next) {
    try {
        const getData = {
            namaBagian: req.query.nama_jabatan,
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
        };
        const employment = await adminEmployment.find_employment_model(getData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment.data
            });
        }
        else {
            throw console_1.error;
        }
    }
    catch (error) {
        next(error);
    }
}
async function find_fixed_employment(req, res, next) {
    try {
        const getData = {
            namaJabatan: req.query.nama_jabatan,
        };
        const employment = await adminEmployment.find_employment_fixed_model(getData);
        if ("data" in employment) {
            if (employment.data != null) {
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
            throw employment;
        }
    }
    catch (error) {
        return next(error);
    }
}
async function detail_employment(req, res, next) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        };
        const employment = await adminEmployment.get_detail_employment_model(paramData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment.data
            });
        }
        else {
            throw console_1.error;
        }
    }
    catch (error) {
        next(error);
    }
}
async function update_employment(req, res, next) {
    try {
        const postData = {
            id: req.params.id,
            namaJabatan: req.body?.nama_jabatan == undefined ? undefined : req.body?.nama_jabatan,
            isActive: req.body?.is_active == undefined ? undefined : req.body?.is_active === "true" ? true : false
        };
        //console.log(postData)
        const employment = await adminEmployment.update_employment_model(postData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment?.data,
                message: "update jabatan berhasil"
            });
        }
        else {
            throw console_1.error;
        }
    }
    catch (error) {
        next(error);
    }
}
async function hard_delete_employment(req, res, next) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        };
        const employment = await adminEmployment.delete_employment_model(paramData);
        if ("data" in employment) {
            res.status(200).json({
                data: employment.data,
                message: "delete jabatan berhasil"
            });
        }
        else {
            throw console_1.error;
        }
    }
    catch (error) {
        next(error);
    }
}
