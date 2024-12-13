"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaKnownRequestError = void 0;
const custom_error_1 = require("./custom_error");
class PrismaKnownRequestError extends custom_error_1.CustomError {
    constructor(error) {
        super(error.message);
        this.error = error;
        this.statusCode = 400;
        this.logger = true;
        this.errors = [{
                message: error.message,
                context: {
                    code: error.code,
                    meta: error.meta
                }
            }];
        Object.setPrototypeOf(this, PrismaKnownRequestError.prototype);
    }
}
exports.PrismaKnownRequestError = PrismaKnownRequestError;
