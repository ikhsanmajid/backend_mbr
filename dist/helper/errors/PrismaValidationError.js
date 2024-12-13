"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaValidationError = void 0;
const custom_error_1 = require("./custom_error");
class PrismaValidationError extends custom_error_1.CustomError {
    constructor(error) {
        super(error.message);
        this.error = error;
        this.statusCode = 400;
        this.logger = true;
        this.errors = [{
                message: error.message,
                context: {
                    stack: error.stack
                }
            }];
        Object.setPrototypeOf(this, PrismaValidationError.prototype);
    }
}
exports.PrismaValidationError = PrismaValidationError;
