import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

export interface CustomError {
    type: string,
    lib?: string,
    code?: string,
    message?: string,
    modelName?: unknown,
    target?: unknown,
    stack?: unknown
}

type Result<T> = T | any

export function handling_error(error: any, custom?: any): Result<CustomError> {
    let errorMsg: CustomError = {
        type: "error",
    };

    if (error instanceof PrismaClientKnownRequestError) {
        Object.assign(errorMsg, {
            lib: "prisma",
            code: error.code,
            message: error.message,
            modelName: error.meta?.modelName,
            target: error.meta?.target,
            stack: error.stack
        })

        //console.log(error.meta)
    } else if (error instanceof PrismaClientValidationError) {
        Object.assign(errorMsg, {
            lib: "prisma",
            code: "V001",
            message: error.message,
            stack: error.stack
        })
    } else {
        Object.assign(errorMsg, {
            code: custom?.code,
            message: custom?.message
        })
    }

    //throw error;
    return errorMsg
}