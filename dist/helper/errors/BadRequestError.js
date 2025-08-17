"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const custom_error_1 = require("./custom_error");
class BadRequestError extends custom_error_1.CustomError {
    constructor(params) {
        const { statusCode, message, logger } = params || {};
        super(message || "Bad Request");
        this._code = statusCode || BadRequestError._statusCode;
        this._logger = logger || true;
        this._context = params?.context || {};
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    get errors() {
        return [{ message: this.message, context: this._context }];
    }
    get statusCode() {
        return this._code;
    }
    get logger() {
        return this._logger;
    }
    static fromPrismaError(error, logger) {
        return new BadRequestError({
            statusCode: 400,
            message: error.message,
            logger,
            context: {
                code: 'code' in error ? error.code : "V001",
                name: error.name,
                meta: error instanceof library_1.PrismaClientKnownRequestError ? error.meta : null,
                stack: error.stack
            }
        });
    }
}
BadRequestError._statusCode = 400;
exports.default = BadRequestError;
