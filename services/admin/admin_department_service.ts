import { PrismaClient } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";


//SECTION - Department Model Admin
const prisma = new PrismaClient();

interface Department {
    id: number;
    namaBagian?: string;
    isActive?: boolean;
}

//ANCHOR - Tambah Bagian
export async function add_department_model(data: any): Promise<ResultModel<Department | null>> {
    try {
        const department = await prisma.bagian.create({
            data: {
                namaBagian: data.namaBagian,
                isActive: data.isActive
            },
            select: {
                id: true,
                namaBagian: true,
                isActive: true
            }
        })

        return { data: department }

    } catch (error: any) {
        throw error
    }
}

//ANCHOR - Menampilkan semua bagian
export async function find_all_department_model(data: any): Promise<ResultModel<Department[] | null>> {
    try {
        const department = await prisma.bagian.findMany({
            select: {
                id: true,
                namaBagian: true,
                isActive: true,
            },
            where: {
                isActive: data.isActive,
                namaBagian: {
                    contains: data.search
                }
            },
            orderBy: {
                namaBagian: "asc"
            }
            ,
            skip: (data.offset ? parseInt(data.offset) : undefined),
            take: (data.limit ? parseInt(data.limit) : undefined)
        })

        const count = await prisma.bagian.count({
            where: {
                isActive: data.isActive,
                namaBagian: {
                    contains: data.search
                }
            }
        })

        return { data: department, count: count }

    } catch (error: any) {
        throw error
    }
}

//ANCHOR - Menampilkan detail bagian
export async function get_detail_department_model(data: any): Promise<ResultModel<Department | null>> {
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
        })
        return { data: department }

    } catch (error: any) {
        throw error
    }
}

//ANCHOR - Menampilkan cari bagian by nama
export async function find_department_model(data: any): Promise<ResultModel<Department[] | null>> {
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
        })

        //console.log(department)

        return { data: department }

    } catch (error: any) {
        throw error
    }
}

export async function find_department_fixed_model(data: any): Promise<ResultModel<Department | null>> {
    try {
        const department = await prisma.bagian.findFirst({
            select: {
                id: true,
            },
            where: {
                namaBagian: data.namaBagian
            }
        })

        //console.log(department)

        return { data: department }

    } catch (error: any) {
        throw error
    }
}

//ANCHOR - Update bagian
export async function update_department_model(data: any): Promise<ResultModel<Department | null>> {
    try {

        const department = await prisma.bagian.update({
            where: {
                id: parseInt(data.id)
            },
            data: {
                namaBagian: data.namaBagian,
                isActive: data.isActive,
            },
            select: {
                id: true,
                namaBagian: true,
                isActive: true
            }
        })

        return { data: department }

    } catch (error: any) {
        throw error
    }
}

export async function delete_department_model(data: any): Promise<ResultModel<Department | null>> {
    try {
        const department = await prisma.bagian.delete({
            where: {
                id: data.id
            }
        })

        return { data: department }

    } catch (error: any) {
        throw error
    }
}

//!SECTION