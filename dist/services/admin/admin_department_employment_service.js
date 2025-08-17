"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_department_employment_model = add_department_employment_model;
exports.find_all_department_employment_model = find_all_department_employment_model;
exports.find_department_employment_model = find_department_employment_model;
exports.find_fixed_department_employment_model = find_fixed_department_employment_model;
exports.get_detail_department_employment_model = get_detail_department_employment_model;
exports.find_bagian_department_employment_model = find_bagian_department_employment_model;
exports.update_department_employment_model = update_department_employment_model;
exports.delete_department_employment_model = delete_department_employment_model;
exports.find_id_department_employment_model = find_id_department_employment_model;
const client_1 = require("@prisma/client");
//SECTION - Bagian VS Jabatan Model Admin
const prisma = new client_1.PrismaClient();
async function add_department_employment_model(data) {
    try {
        const transaction = await prisma.$transaction(async (tx) => {
            const bagianAndJabatan = await tx.bagianonjabatan.findFirst({
                select: {
                    id: true,
                },
                where: {
                    idBagian: parseInt(data.idBagian),
                    idJabatan: parseInt(data.idJabatan)
                }
            });
            if (bagianAndJabatan?.id != null) {
                return 0;
            }
            const departmentEmployment = await tx.bagianonjabatan.create({
                data: {
                    idBagian: parseInt(data.idBagian),
                    idJabatan: parseInt(data.idJabatan)
                },
                select: {
                    id: true,
                    idBagianFK: {
                        select: {
                            namaBagian: true
                        }
                    },
                    idJabatanFK: {
                        select: {
                            namaJabatan: true
                        }
                    }
                }
            });
            return departmentEmployment;
        });
        if (transaction == 0) {
            return { data: "data sudah ada" };
        }
        else {
            return { data: transaction };
        }
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan semua bagian vs jabatan
async function find_all_department_employment_model(data) {
    try {
        const departmentEmployment = await prisma.bagianonjabatan.findMany({
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            },
            orderBy: {
                idBagianFK: {
                    namaBagian: "asc"
                }
            },
            skip: (data.offset ? parseInt(data.offset) : undefined),
            take: (data.limit ? parseInt(data.limit) : undefined)
        });
        const count = await prisma.bagianonjabatan.count();
        return { data: departmentEmployment, count: count };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan semua bagian vs jabatan
async function find_department_employment_model(data) {
    try {
        const conditions = new Array();
        if (data.namaBagian) {
            conditions.push({
                idBagianFK: {
                    namaBagian: {
                        contains: data.namaBagian
                    }
                }
            });
        }
        if (data.namaJabatan) {
            conditions.push({
                idJabatanFK: {
                    namaJabatan: {
                        contains: data.namaJabatan
                    }
                }
            });
        }
        const departmentEmployment = await prisma.bagianonjabatan.findMany({
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            },
            where: {
                AND: conditions.length > 0 ? conditions : undefined
            },
            orderBy: {
                idBagianFK: {
                    namaBagian: data.sort
                }
            }
        });
        const count = await prisma.bagianonjabatan.count();
        return { data: departmentEmployment, count: count };
    }
    catch (error) {
        throw error;
    }
}
async function find_fixed_department_employment_model(data) {
    try {
        const departmentEmployment = await prisma.bagianonjabatan.findFirst({
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            },
            where: {
                AND: {
                    idBagian: parseInt(data.idBagian),
                    idJabatan: parseInt(data.idJabatan)
                }
            }
        });
        return { data: departmentEmployment };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan detail bagian vs jabatan
async function get_detail_department_employment_model(data) {
    try {
        const departmentEmployment = await prisma.bagianonjabatan.findFirst({
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            },
            where: {
                id: data.id
            }
        });
        return { data: departmentEmployment };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan semua jabatan di bagian
async function find_bagian_department_employment_model(data) {
    try {
        const departmentEmployment = await prisma.bagianonjabatan.findMany({
            select: {
                id: true,
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            },
            where: {
                idBagian: data.idBagian
            }
        });
        return { data: departmentEmployment };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - update bagian vs jabatan
async function update_department_employment_model(data) {
    try {
        const update = await prisma.bagianonjabatan.update({
            where: {
                id: data.id
            },
            data: {
                idBagian: data.idBagian,
                idJabatan: data.idJabatan
            },
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            }
        });
        return { data: update };
    }
    catch (error) {
        throw error;
    }
}
async function delete_department_employment_model(data) {
    try {
        const deleteData = await prisma.bagianonjabatan.delete({
            where: {
                id: data.id
            },
            select: {
                id: true,
                idBagianFK: {
                    select: {
                        id: true,
                        namaBagian: true,
                    }
                },
                idJabatanFK: {
                    select: {
                        id: true,
                        namaJabatan: true,
                    }
                }
            }
        });
        return { data: deleteData };
    }
    catch (error) {
        throw error;
    }
}
//ANCHOR - Menampilkan semua jabatan di bagian
async function find_id_department_employment_model(data) {
    try {
        const departmentEmployment = await prisma.bagianonjabatan.findFirst({
            where: {
                AND: {
                    idBagian: parseInt(data.idBagian),
                    idJabatan: parseInt(data.idJabatan)
                }
            },
            select: {
                id: true,
            },
        });
        if (departmentEmployment == null) {
            return { data: null };
        }
        return { data: departmentEmployment };
    }
    catch (error) {
        throw error;
    }
}
//!SECTION
