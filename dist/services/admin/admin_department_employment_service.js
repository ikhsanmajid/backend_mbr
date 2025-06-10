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
function add_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transaction = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const bagianAndJabatan = yield tx.bagianonjabatan.findFirst({
                    select: {
                        id: true,
                    },
                    where: {
                        idBagian: parseInt(data.idBagian),
                        idJabatan: parseInt(data.idJabatan)
                    }
                });
                if ((bagianAndJabatan === null || bagianAndJabatan === void 0 ? void 0 : bagianAndJabatan.id) != null) {
                    return 0;
                }
                const departmentEmployment = yield tx.bagianonjabatan.create({
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
            }));
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
    });
}
//ANCHOR - Menampilkan semua bagian vs jabatan
function find_all_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentEmployment = yield prisma.bagianonjabatan.findMany({
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
            const count = yield prisma.bagianonjabatan.count();
            return { data: departmentEmployment, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
//ANCHOR - Menampilkan semua bagian vs jabatan
function find_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const departmentEmployment = yield prisma.bagianonjabatan.findMany({
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
            const count = yield prisma.bagianonjabatan.count();
            return { data: departmentEmployment, count: count };
        }
        catch (error) {
            throw error;
        }
    });
}
function find_fixed_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentEmployment = yield prisma.bagianonjabatan.findFirst({
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
    });
}
//ANCHOR - Menampilkan detail bagian vs jabatan
function get_detail_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentEmployment = yield prisma.bagianonjabatan.findFirst({
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
    });
}
//ANCHOR - Menampilkan semua jabatan di bagian
function find_bagian_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentEmployment = yield prisma.bagianonjabatan.findMany({
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
    });
}
//ANCHOR - update bagian vs jabatan
function update_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const update = yield prisma.bagianonjabatan.update({
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
    });
}
function delete_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteData = yield prisma.bagianonjabatan.delete({
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
    });
}
//ANCHOR - Menampilkan semua jabatan di bagian
function find_id_department_employment_model(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentEmployment = yield prisma.bagianonjabatan.findFirst({
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
    });
}
//!SECTION
