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
    const requestBodyForLog = { ...req.body };
    if (requestBodyForLog.password) {
        delete requestBodyForLog.password;
    }
    const request = {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        body: requestBodyForLog,
        query: req.query,
        params: req.params,
    };
    if (err instanceof custom_error_1.CustomError) {
        if (err.logger) {
            logger_1.default.error('[ERROR] CustomError: %o', { message: err.message, context: err.errors, request: request });
        }
        return res.status(err.statusCode).send({ type: "error", errors: err.errors });
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        const prismaError = new PrismaKnownRequestError_1.PrismaKnownRequestError(err);
        if (prismaError.logger) {
            logger_1.default.error('[ERROR] PrismaError: %o', { message: prismaError.message, context: prismaError.errors, request: request });
        }
        return res.status(prismaError.statusCode).send({ type: "error", errors: prismaError.errors[0].context?.code });
    }
    if (err instanceof library_1.PrismaClientValidationError) {
        const prismaError = new PrismaValidationError_1.PrismaValidationError(err);
        if (prismaError.logger) {
            logger_1.default.error('[ERROR] PrismaError: %o', { message: prismaError.message, context: prismaError.error.message, request: request });
        }
        return res.status(prismaError.statusCode).send({ type: "error", errors: prismaError.statusCode });
    }
    logger_1.default.error('[ERROR] UnknownError: %o', { error: err, request: request });
    res.status(500).send({ type: "error", errors: [{ message: err.message.length !== 0 ? err.message : 'Ada Kesalahan Backend' }] });
};
exports.errorHandler = errorHandler;
