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
exports.add_employment = add_employment;
exports.find_all = find_all;
exports.find_employment = find_employment;
exports.find_fixed_employment = find_fixed_employment;
exports.detail_employment = detail_employment;
exports.update_employment = update_employment;
exports.hard_delete_employment = hard_delete_employment;
const adminEmployment = __importStar(require("../../services/admin/admin_employment_service"));
const console_1 = require("console");
function add_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postData = {
                namaJabatan: req.body.nama_jabatan,
                isActive: req.body.is_active == undefined ? true : req.body.is_active === "true" ? true : false
            };
            const employment = yield adminEmployment.add_employment_model(postData);
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
    });
}
function find_all(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false,
                limit: req.query.limit == undefined ? undefined : req.query.limit,
                offset: req.query.offset == undefined ? undefined : req.query.offset
            };
            const employment = yield adminEmployment.find_all_employment_model(getData);
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
    });
}
function find_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                namaBagian: req.query.nama_jabatan,
                isActive: req.query.is_active == undefined ? undefined : req.query.is_active === "true" ? true : false
            };
            const employment = yield adminEmployment.find_employment_model(getData);
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
    });
}
function find_fixed_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getData = {
                namaJabatan: req.query.nama_jabatan,
            };
            const employment = yield adminEmployment.find_employment_fixed_model(getData);
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
    });
}
function detail_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const employment = yield adminEmployment.get_detail_employment_model(paramData);
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
    });
}
function update_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const postData = {
                id: req.params.id,
                namaJabatan: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.nama_jabatan) == undefined ? undefined : (_b = req.body) === null || _b === void 0 ? void 0 : _b.nama_jabatan,
                isActive: ((_c = req.body) === null || _c === void 0 ? void 0 : _c.is_active) == undefined ? undefined : ((_d = req.body) === null || _d === void 0 ? void 0 : _d.is_active) === "true" ? true : false
            };
            //console.log(postData)
            const employment = yield adminEmployment.update_employment_model(postData);
            if ("data" in employment) {
                res.status(200).json({
                    data: employment === null || employment === void 0 ? void 0 : employment.data,
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
    });
}
function hard_delete_employment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paramData = {
                id: parseInt(req.params.id)
            };
            const employment = yield adminEmployment.delete_employment_model(paramData);
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
    });
}
