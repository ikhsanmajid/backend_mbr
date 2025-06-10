"use strict";
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
exports.add_department_model = add_department_model;
exports.find_all_department_model = find_all_department_model;
exports.get_detail_department_model = get_detail_department_model;
exports.find_department_model = find_department_model;
exports.find_department_fixed_model = find_department_fixed_model;
exports.update_department_model = update_department_model;
exports.delete_department_model = delete_department_model;
const client_1 = require("@prisma/client");
//SECTION - Department Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Tambah Bagian
function add_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.create({
                data: {
                    namaBagian: data.namaBagian,
                    isActive: data.isActive,
                    idJenisBagian: data.kategori
                },
                select: {
                    id: true,
                    namaBagian: true,
                    isActive: true
                }
            });
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Menampilkan semua bagian
function find_all_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.findMany({
                select: {
                    id: true,
                    namaBagian: true,
                    isActive: true,
                    idJenisBagianFK: {
                        select: {
                            id: true,
                            namaJenisBagian: true
                        }
                    }
                },
                where: Object.assign({ isActive: data.isActive, namaBagian: {
                        contains: data.search
                    } }, (data.manufaktur && {
                    idJenisBagian: {
                        in: [1, 2],
                    }
                })),
                orderBy: {
                    namaBagian: "asc"
                },
                skip: (data.offset ? parseInt(data.offset) : undefined),
                take: (data.limit ? parseInt(data.limit) : undefined)
            });
            const result = new Array();
            department.forEach((element) => {
                result.push({
                    id: element.id,
                    namaBagian: element.namaBagian,
                    isActive: element.isActive,
                    idJenisBagian: element.idJenisBagianFK.id,
                    namaJenisBagian: element.idJenisBagianFK.namaJenisBagian
                });
            });
            const count = yield prisma.bagian.count({
                where: {
                    isActive: data.isActive,
                    namaBagian: {
                        contains: data.search
                    }
                }
            });
            return { data: result, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Menampilkan detail bagian
function get_detail_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.findFirst({
                select: {
                    id: true,
                    namaBagian: true,
                    isActive: true
                },
                where: {
                    id: data.id
                }
            });
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Menampilkan cari bagian by nama
function find_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.findMany({
                select: {
                    id: true,
                    namaBagian: true,
                    isActive: true
                },
                where: {
                    AND: [
                        {
                            namaBagian: {
                                startsWith: "%" + data.namaBagian + "%"
                            }
                        },
                        {
                            isActive: data.isActive
                        }
                    ]
                }
            });
            //console.log(department)
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
function find_department_fixed_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.findFirst({
                select: {
                    id: true,
                },
                where: {
                    namaBagian: data.namaBagian
                }
            });
            //console.log(department)
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Update bagian
function update_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.update({
                where: {
                    id: parseInt(data.id)
                },
                data: {
                    namaBagian: data.namaBagian,
                    isActive: data.isActive,
                    idJenisBagian: data.kategori
                },
                select: {
                    id: true,
                    namaBagian: true,
                    isActive: true
                }
            });
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
function delete_department_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = yield prisma.bagian.delete({
                where: {
                    id: data.id
                }
            });
            return { data: department };
        }
        catch (error) {
            throw error;
        }
    });
}
//!SECTION
