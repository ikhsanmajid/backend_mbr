"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handling_error = handling_error;
const library_1 = require("@prisma/client/runtime/library");
function handling_error(error, custom) {
    var _a, _b;
    let errorMsg = {
        type: "error",
    };
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        Object.assign(errorMsg, {
            lib: "prisma",
            code: error.code,
            message: error.message,
            modelName: (_a = error.meta) === null || _a === void 0 ? void 0 : _a.modelName,
            target: (_b = error.meta) === null || _b === void 0 ? void 0 : _b.target,
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
            code: custom === null || custom === void 0 ? void 0 : custom.code,
            message: custom === null || custom === void 0 ? void 0 : custom.message
        });
    }
    //throw error;
    return errorMsg;
}
