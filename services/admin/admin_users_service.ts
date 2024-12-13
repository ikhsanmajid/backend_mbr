import { PrismaClient } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";

const prisma = new PrismaClient();

interface User {
    id: number;
    dateCreated?: Date;
    email?: string;
    isActive?: boolean;
    isAdmin?: boolean;
    jabatanBagian?: any;
    nama?: string;
    nik?: string;
    password?: string;
}

export async function add_user_model(data: any): Promise<ResultModel<User | null>> {

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
        })

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function check_email_model(data: any): Promise<ResultModel<User | null>> {

    try {
        const user = await prisma.users.findFirst({
            where: {
                email: data.email,
            },
            select: {
                id: true,
                email: true
            }
        })

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function check_nik_model(data: any): Promise<ResultModel<User | null>> {

    try {
        const user = await prisma.users.findFirst({
            where: {
                nik: data.nik,
            },
            select: {
                id: true,
                nik: true
            }
        })

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function find_user_model(data: any): Promise<ResultModel<User | null>> {
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

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function find_user_by_id(data: { id: number }): Promise<ResultModel<User | null>> {
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

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function get_department_user_by_id(data: { id: number }): Promise<ResultModel<{ idBagian: number } | null>> {
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
        })

        if (department?.jabatanBagian.length == 0) {
            return null
        }

        const result: { idBagian: number } = {
            idBagian: Number(department?.jabatanBagian[0].idBagianJabatanFK.idBagian)
        }

        return { data: result }

    } catch (error: any) {
        throw error
    }
}

export async function get_detail_user_model(data: any): Promise<ResultModel<User | null>> {
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

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function find_all_users_model(data: any): Promise<ResultModel<User[]>> {
    try {
        let active = data.active == null || data.active == "all" ? undefined : data.active
        let search_user = data.search_user == null ? undefined : data.search_user

        if (active == "onlyActive") {
            active = true
        } else if (active == "onlyInactive") {
            active = false
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
        })

        return { data: user, count: countUser }

    } catch (error: any) {
        throw error
    }
}

export async function update_user_model(data: any): Promise<ResultModel<User>> {
    try {

        let password = data.password == "" ? undefined : data.password

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
        })

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function delete_users_model(data: any): Promise<ResultModel<User>> {
    try {
        const user = await prisma.users.delete({
            where: {
                id: data.id
            }
        })

        return { data: user }

    } catch (error: any) {
        throw error
    }
}

export async function delete_user_department_model(data: any): Promise<ResultModel<User | null>> {

    try {
        const deleteProcess = await prisma.usersonbagianonjabatan.delete({
            where: {
                id: data.id
            },
            select: {
                id: true
            }
        })

        return { data: deleteProcess }

    } catch (error: any) {
        throw error
    }
}

export async function update_user_department_model(data: any): Promise<ResultModel<User | null>> {

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
        })

        return { data: updateProcess }

    } catch (error: any) {
        throw error
    }
}

export async function add_user_department_model(data: any): Promise<ResultModel<User | null>> {

    try {

        const insertProcess = await prisma.usersonbagianonjabatan.create({
            data: {
                idUsers: data.idUser,
                idBagianJabatan: data.idBagianJabatan,
            },
            select: {
                id: true
            }
        })

        return { data: insertProcess }

    } catch (error: any) {
        throw error
    }
}