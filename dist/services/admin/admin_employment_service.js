"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_employment_model = add_employment_model;
exports.find_all_employment_model = find_all_employment_model;
exports.find_employment_model = find_employment_model;
exports.find_employment_fixed_model = find_employment_fixed_model;
exports.get_detail_employment_model = get_detail_employment_model;
exports.update_employment_model = update_employment_model;
exports.delete_employment_model = delete_employment_model;
const client_1 = require("@prisma/client");
//SECTION - Jabatan Model Admin
const prisma = new client_1.PrismaClient();
//ANCHOR - Tambah Jabatan
async function add_employment_model(data) {
    try {
        const employment = await prisma.jabatan.create({
            data: {
                namaJabatan: data.namaJabatan,
                isActive: data.isActive
            },
            select: {
                id: true,
                namaJabatan: true,
                isActive: true
            }
        });
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan semua jabatan
async function find_all_employment_model(data) {
    try {
        const employment = await prisma.jabatan.findMany({
            select: {
                id: true,
                namaJabatan: true,
                isActive: true
            },
            where: {
                isActive: data.isActive
            },
            orderBy: {
                namaJabatan: "asc"
            },
            skip: (data.offset ? parseInt(data.offset) : undefined),
            take: (data.limit ? parseInt(data.limit) : undefined)
        });
        const count = await prisma.jabatan.count();
        return { data: employment, count: count };
    }
    catch (error) {
        throw error;
    }
}
async function find_employment_model(data) {
    try {
        const employment = await prisma.jabatan.findMany({
            select: {
                id: true,
                namaJabatan: true,
                isActive: true
            },
            where: {
                AND: [
                    {
                        namaJabatan: {
                            contains: data.namaBagian
                        }
                    },
                    {
                        isActive: data.isActive
                    }
                ]
            }
        });
        //console.log(department)
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
async function find_employment_fixed_model(data) {
    try {
        const employment = await prisma.jabatan.findFirst({
            select: {
                id: true,
            },
            where: {
                namaJabatan: data.namaJabatan
            }
        });
        //console.log(department)
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
async function get_detail_employment_model(data) {
    try {
        const employment = await prisma.jabatan.findFirst({
            select: {
                id: true,
                namaJabatan: true,
                isActive: true
            },
            where: {
                id: data.id
            }
        });
        //console.log(department)
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
async function update_employment_model(data) {
    try {
        const employment = await prisma.jabatan.update({
            where: {
                id: parseInt(data.id)
            },
            data: {
                namaJabatan: data.namaJabatan,
                isActive: data.isActive,
            },
            select: {
                id: true,
                namaJabatan: true,
                isActive: true
            }
        });
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
async function delete_employment_model(data) {
    try {
        const employment = await prisma.jabatan.delete({
            where: {
                id: data.id
            }
        });
        return { data: employment };
    }
    catch (error) {
        throw error;
    }
}
//!SECTION
