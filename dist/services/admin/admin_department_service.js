"use strict";
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
async function add_department_model(data) {
    try {
        const department = await prisma.bagian.create({
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
}
//ANCHOR - Menampilkan semua bagian
async function find_all_department_model(data) {
    try {
        const department = await prisma.bagian.findMany({
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
            where: {
                isActive: data.isActive,
                namaBagian: {
                    contains: data.search
                },
                ...(data.manufaktur && {
                    idJenisBagian: {
                        in: [1, 2],
                    }
                }),
            },
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
        const count = await prisma.bagian.count({
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
}
//ANCHOR - Menampilkan detail bagian
async function get_detail_department_model(data) {
    try {
        const department = await prisma.bagian.findFirst({
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
}
//ANCHOR - Menampilkan cari bagian by nama
async function find_department_model(data) {
    try {
        const department = await prisma.bagian.findMany({
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
}
async function find_department_fixed_model(data) {
    try {
        const department = await prisma.bagian.findFirst({
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
}
//ANCHOR - Update bagian
async function update_department_model(data) {
    try {
        const department = await prisma.bagian.update({
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
}
async function delete_department_model(data) {
    try {
        const department = await prisma.bagian.delete({
            where: {
                id: data.id
            }
        });
        return { data: department };
    }
    catch (error) {
        throw error;
    }
}
//!SECTION
