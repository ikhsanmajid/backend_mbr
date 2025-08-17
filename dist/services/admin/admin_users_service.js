"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_admin_mail = get_admin_mail;
exports.get_dco_mail = get_dco_mail;
exports.add_user_model = add_user_model;
exports.check_email_model = check_email_model;
exports.check_nik_model = check_nik_model;
exports.find_user_model = find_user_model;
exports.find_user_by_id = find_user_by_id;
exports.get_department_user_by_id = get_department_user_by_id;
exports.get_detail_user_model = get_detail_user_model;
exports.find_all_users_model = find_all_users_model;
exports.update_user_model = update_user_model;
exports.update_user_password_model = update_user_password_model;
exports.delete_users_model = delete_users_model;
exports.delete_user_department_model = delete_user_department_model;
exports.update_user_department_model = update_user_department_model;
exports.add_user_department_model = add_user_department_model;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function get_admin_mail() {
    try {
        const getMailList = await prisma.users.findMany({
            select: {
                id: true,
                email: true
            },
            where: {
                isActive: true,
                isAdmin: true,
                NOT: {
                    jabatanBagian: {
                        some: {
                            idBagianJabatanFK: {
                                idJabatanFK: {
                                    OR: [{
                                            namaJabatan: "Manager"
                                        }, {
                                            namaJabatan: "Officer"
                                        }]
                                }
                            }
                        }
                    }
                }
            }
        });
        return { data: getMailList };
    }
    catch (error) {
        throw error;
    }
}
async function get_dco_mail() {
    try {
        const getMailList = await prisma.users.findMany({
            select: {
                id: true,
                email: true,
            },
            where: {
                AND: [
                    {
                        jabatanBagian: {
                            some: {
                                idBagianJabatanFK: {
                                    AND: [
                                        { idBagianFK: { namaBagian: "Document Control" } },
                                        { idJabatanFK: { namaJabatan: "Officer" } }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        isActive: true
                    }
                ]
            }
        });
        return { data: getMailList };
    }
    catch (error) {
        throw error;
    }
}
async function add_user_model(data) {
    try {
        const user = await prisma.users.create({
            data: {
                nama: data.nama,
                nik: data.nik,
                email: data.email,
                password: data.password,
                isAdmin: data.isAdmin,
                isActive: data.isActive,
                dateCreated: data.dateCreated
            },
            select: {
                id: true,
                email: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function check_email_model(data) {
    try {
        const user = await prisma.users.findFirst({
            where: {
                email: data.email,
            },
            select: {
                id: true,
                email: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function check_nik_model(data) {
    try {
        const user = await prisma.users.findFirst({
            where: {
                nik: data.nik,
            },
            select: {
                id: true,
                nik: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function find_user_model(data) {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: data.email
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                isAdmin: true,
                dateCreated: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function find_user_by_id(data) {
    try {
        const user = await prisma.users.findFirst({
            where: {
                id: data.id
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                isAdmin: true,
                dateCreated: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function get_department_user_by_id(data) {
    try {
        const department = await prisma.users.findFirst({
            where: {
                id: data.id
            },
            select: {
                jabatanBagian: {
                    select: {
                        idBagianJabatanFK: {
                            select: {
                                idBagian: true
                            }
                        }
                    }
                }
            }
        });
        if (department?.jabatanBagian.length == 0) {
            return null;
        }
        const result = {
            idBagian: Number(department?.jabatanBagian[0].idBagianJabatanFK.idBagian)
        };
        return { data: result };
    }
    catch (error) {
        throw error;
    }
}
async function get_detail_user_model(data) {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: data.id
            },
            select: {
                id: true,
                email: true,
                nik: true,
                nama: true,
                isActive: true,
                isAdmin: true,
                dateCreated: true,
                jabatanBagian: {
                    select: {
                        id: true,
                        idBagianJabatan: true,
                        idBagianJabatanFK: {
                            select: {
                                idBagianFK: {
                                    select: {
                                        id: true,
                                        namaBagian: true,
                                    }
                                },
                                idJabatanFK: {
                                    select: {
                                        id: true,
                                        namaJabatan: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function find_all_users_model(data) {
    try {
        let active = data.active == null || data.active == "all" ? undefined : data.active;
        let search_user = data.search_user == null ? undefined : data.search_user;
        if (active == "onlyActive") {
            active = true;
        }
        else if (active == "onlyInactive") {
            active = false;
        }
        const user = await prisma.users.findMany({
            select: {
                id: true,
                nik: true,
                nama: true,
                email: true,
                isActive: true,
                isAdmin: true,
                dateCreated: true
            },
            where: {
                AND: [
                    { isActive: active },
                    {
                        OR: [
                            {
                                nama: {
                                    contains: search_user
                                }
                            },
                            {
                                nik: search_user
                            },
                            {
                                email: {
                                    contains: search_user
                                }
                            }
                        ]
                    }
                ]
            },
            orderBy: {
                nik: "asc"
            },
            skip: data.offset !== null ? parseInt(data.offset) : undefined,
            take: data.limit !== null ? parseInt(data.limit) : undefined
        });
        const countUser = await prisma.users.count({
            where: {
                AND: [
                    { isActive: active },
                    {
                        OR: [
                            {
                                nama: {
                                    contains: search_user
                                }
                            },
                            {
                                nik: search_user
                            },
                            {
                                email: {
                                    contains: search_user
                                }
                            }
                        ]
                    }
                ]
            }
        });
        return { data: user, count: countUser };
    }
    catch (error) {
        throw error;
    }
}
async function update_user_model(data) {
    try {
        let password = data.password == "" ? undefined : data.password;
        const user = await prisma.users.update({
            where: {
                id: parseInt(data.id)
            },
            data: {
                nama: data.nama,
                nik: data.nik,
                email: data.email,
                password: password ?? undefined,
                isActive: data.isActive,
                isAdmin: data.isAdmin
            },
            select: {
                id: true,
                nik: true,
                nama: true,
                email: true,
                isActive: true,
                isAdmin: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function update_user_password_model(id, password) {
    try {
        const user = await prisma.users.update({
            where: {
                id: id
            },
            data: {
                password: password
            },
            select: {
                id: true,
                nik: true,
                nama: true,
                email: true,
                isActive: true,
                isAdmin: true
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function delete_users_model(data) {
    try {
        const user = await prisma.users.delete({
            where: {
                id: data.id
            }
        });
        return { data: user };
    }
    catch (error) {
        throw error;
    }
}
async function delete_user_department_model(data) {
    try {
        const deleteProcess = await prisma.usersonbagianonjabatan.delete({
            where: {
                id: data.id
            },
            select: {
                id: true
            }
        });
        return { data: deleteProcess };
    }
    catch (error) {
        throw error;
    }
}
async function update_user_department_model(data) {
    try {
        const updateProcess = await prisma.usersonbagianonjabatan.update({
            where: {
                id: data.id
            },
            data: {
                idBagianJabatan: data.idBagianJabatan
            },
            select: {
                id: true
            }
        });
        return { data: updateProcess };
    }
    catch (error) {
        throw error;
    }
}
async function add_user_department_model(data) {
    try {
        const insertProcess = await prisma.usersonbagianonjabatan.create({
            data: {
                idUsers: data.idUser,
                idBagianJabatan: data.idBagianJabatan,
            },
            select: {
                id: true
            }
        });
        return { data: insertProcess };
    }
    catch (error) {
        throw error;
    }
}
