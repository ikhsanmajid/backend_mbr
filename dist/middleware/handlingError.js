"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const library_1 = require("@prisma/client/runtime/library");
const custom_error_1 = require("../helper/errors/custom_error");
const PrismaKnownRequestError_1 = require("../helper/errors/PrismaKnownRequestError");
const PrismaValidationError_1 = require("../helper/errors/PrismaValidationError");
const logger_1 = __importDefault(require("../helper/logger"));
const errorHandler = (err, req, res, next) => {
    var _a;
    if (err instanceof custom_error_1.CustomError) {
        if (err.logger) {
            logger_1.default.error('CustomError: %o', { message: err.message, context: err.errors });
        }
        return res.status(err.statusCode).send({ type: "error", errors: err.errors });
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        const prismaError = new PrismaKnownRequestError_1.PrismaKnownRequestError(err);
        if (prismaError.logger) {
            logger_1.default.error('PrismaError: %o', { message: prismaError.message, context: prismaError.errors });
        }
        return res.status(prismaError.statusCode).send({ type: "error", errors: (_a = prismaError.errors[0].context) === null || _a === void 0 ? void 0 : _a.code });
    }
    if (err instanceof library_1.PrismaClientValidationError) {
        const prismaError = new PrismaValidationError_1.PrismaValidationError(err);
        if (prismaError.logger) {
            logger_1.default.error('PrismaError: %o', { message: prismaError.message, context: prismaError.error.message });
        }
        return res.status(prismaError.statusCode).send({ type: "error", errors: prismaError.statusCode });
    }
    logger_1.default.error('UnknownError: %o', err);
    res.status(500).send({ type: "error", errors: [{ message: err.message.length !== 0 ? err.message : 'Ada Kesalahan Backend' }] });
};
exports.errorHandler = errorHandler;
