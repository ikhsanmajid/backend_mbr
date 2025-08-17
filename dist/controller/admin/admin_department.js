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
exports.add_department = add_department;
exports.find_all = find_all;
exports.detail_department = detail_department;
exports.find_department = find_department;
exports.find_fixed_department = find_fixed_department;
exports.update_department = update_department;
exports.hard_delete_department = hard_delete_department;
const adminDepartment = __importStar(require("../../services/admin/admin_department_service"));
async function add_department(req, res, next) {
    try {
        let postData = {
            namaBagian: req.body.nama_bagian,
            isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false,
            kategori: req.body.kategori == undefined ? undefined : Number(req.body.kategori),
        };
        const department = await adminDepartment.add_department_model(postData);
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
}
async function find_all(req, res, next) {
    try {
        let getData = {
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
            manufaktur: req.query.manufaktur == undefined ? undefined : req.query.manufaktur === "yes" ? true : false,
            limit: req.query.limit == undefined ? undefined : req.query.limit,
            offset: req.query.offset == undefined ? undefined : req.query.offset,
            search: (req.query.search == undefined || req.query.search.length == 0) ? undefined : req.query.search
        };
        //console.log(getData)
        const department = await adminDepartment.find_all_department_model(getData);
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
}
async function detail_department(req, res, next) {
    try {
        let paramData = {
            id: parseInt(req.params.id)
        };
        const department = await adminDepartment.get_detail_department_model(paramData);
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
}
async function find_department(req, res, next) {
    try {
        const getData = {
            namaBagian: req.query.nama_bagian,
            isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
        };
        const department = await adminDepartment.find_department_model(getData);
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
}
async function find_fixed_department(req, res, next) {
    try {
        const getData = {
            namaBagian: req.query.nama_bagian,
        };
        const department = await adminDepartment.find_department_fixed_model(getData);
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
}
async function update_department(req, res, next) {
    try {
        const postData = {
            id: req.params.id,
            namaBagian: req.body?.nama_bagian == undefined ? undefined : req.body?.nama_bagian,
            isActive: req.body?.is_active == undefined ? undefined : req.body?.is_active === "true" ? true : false,
            kategori: req.body?.kategori == undefined ? undefined : Number(req.body?.kategori)
        };
        const department = await adminDepartment.update_department_model(postData);
        if ("data" in department) {
            res.status(200).json({
                data: department?.data,
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
}
async function hard_delete_department(req, res, next) {
    try {
        const paramData = {
            id: parseInt(req.params.id)
        };
        const department = await adminDepartment.delete_department_model(paramData);
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
}
