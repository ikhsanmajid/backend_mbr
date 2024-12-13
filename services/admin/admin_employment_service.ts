import { PrismaClient } from "@prisma/client";
import { ResultModel } from "../../types/admin_types";

//SECTION - Jabatan Model Admin
const prisma = new PrismaClient();

interface Employment {
    id?: number;
    namaJabatan?: string;
    isActive?: boolean;
}

//ANCHOR - Tambah Jabatan
export async function add_employment_model(data: any): Promise<ResultModel<Employment | null>> {
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
        })

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

//ANCHOR - Menampilkan semua jabatan
export async function find_all_employment_model(data: any): Promise<ResultModel<Employment[] | null>> {
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
        })

        const count = await prisma.jabatan.count()

        return { data: employment, count: count }

    } catch (error: any) {
        throw error
    } 
}

export async function find_employment_model(data: any): Promise<ResultModel<Employment[] | null>> {
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
        })

        //console.log(department)

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

export async function find_employment_fixed_model(data: any): Promise<ResultModel<Employment | null>> {
    try {
        const employment = await prisma.jabatan.findFirst({
            select: {
                id: true,
            },
            where: {
                namaJabatan: data.namaJabatan
            }
        })

        //console.log(department)

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

export async function get_detail_employment_model(data: any): Promise<ResultModel<Employment | null>> {
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
        })

        //console.log(department)

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

export async function update_employment_model(data: any): Promise<ResultModel<Employment | null>> {
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
        })

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

export async function delete_employment_model(data: any): Promise<ResultModel<Employment | null>> {
    try {
        const employment = await prisma.jabatan.delete({
            where: {
                id: data.id
            }
        })

        return { data: employment }

    } catch (error: any) {
        throw error
    } 
}

//!SECTION