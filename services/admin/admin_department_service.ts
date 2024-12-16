import { PrismaClient } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";


//SECTION - Department Model Admin
const prisma = new PrismaClient();

interface Department {
    id?: number;
    namaBagian?: string;
    isActive?: boolean;
    idJenisBagian?: number;
    namaJenisBagian?: string;
}

//ANCHOR - Tambah Bagian
export async function add_department_model(data: any): Promise<ResultModel<Department | null>> {
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
            }
            ,
            skip: (data.offset ? parseInt(data.offset) : undefined),
            take: (data.limit ? parseInt(data.limit) : undefined)
        })

        const result: Department[] = new Array()

        department.forEach((element: any) => {
            result.push({
                id: element.id,
                namaBagian: element.namaBagian,
                isActive: element.isActive,
                idJenisBagian: element.idJenisBagianFK.id,
                namaJenisBagian: element.idJenisBagianFK.namaJenisBagian
            })
        })

        const count = await prisma.bagian.count({
            where: {
                isActive: data.isActive,
                namaBagian: {
                    contains: data.search
                }
            }
        })

        return { data: result, count: count }

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
                idJenisBagian: data.kategori
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