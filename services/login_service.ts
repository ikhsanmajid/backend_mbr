import { PrismaClient } from "@prisma/client";
import { ResultModel } from "../types/admin_types";

const prisma = new PrismaClient();

interface LoginUser {
    id: number;
    email: string;
    password: string;
    isAdmin: boolean;
    isActive: boolean;
}

export async function find_one(email: string): Promise<ResultModel<LoginUser | any | null>> {
    try {
        let detail: any | null = null
        const login = await prisma.users.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                nama: true,
                email: true,
                password: true,
                isAdmin: true,
                isActive: true,
            }
        })

        if (login !== null) {
            detail = await prisma.usersonbagianonjabatan.findMany({
                where: {
                    idUsers: login?.id
                },
                select: {
                    idBagianJabatanFK: {
                        select: {
                            idBagianFK: {
                                select: {
                                    id: true,
                                    namaBagian: true
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
            })
        }

        const result = {
            login: login,
            detail: detail
        }

        return { data: result }

    } catch (error: any) {
        throw error

    }
}