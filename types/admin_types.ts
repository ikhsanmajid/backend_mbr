import { PrismaClientValidationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export type ResultModel<T> = { data?: T, count?: number } | { error: PrismaClientKnownRequestError } | { error: PrismaClientValidationError } | null
