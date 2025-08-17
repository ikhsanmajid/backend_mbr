"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handling_error = handling_error;
const library_1 = require("@prisma/client/runtime/library");
function handling_error(error, custom) {
    let errorMsg = {
        type: "error",
    };
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        Object.assign(errorMsg, {
            lib: "prisma",
            code: error.code,
            message: error.message,
            modelName: error.meta?.modelName,
            target: error.meta?.target,
            stack: error.stack
        });
        //console.log(error.meta)
    }
    else if (error instanceof library_1.PrismaClientValidationError) {
        Object.assign(errorMsg, {
            lib: "prisma",
            code: "V001",
            message: error.message,
            stack: error.stack
        });
    }
    else {
        Object.assign(errorMsg, {
            code: custom?.code,
            message: custom?.message
        });
    }
    //throw error;
    return errorMsg;
}
