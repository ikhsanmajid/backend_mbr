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
exports.find_one = find_one;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function find_one(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let detail = null;
            const login = yield prisma.users.findUnique({
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
                detail = yield prisma.usersonbagianonjabatan.findMany({
                    where: {
                        idUsers: login === null || login === void 0 ? void 0 : login.id
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
    });
}
