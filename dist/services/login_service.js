"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find_one = find_one;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function find_one(email) {
    try {
        let detail = null;
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
        });
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
            });
        }
        const result = {
            login: login,
            detail: detail
        };
        return { data: result };
    }
    catch (error) {
        throw error;
    }
}
