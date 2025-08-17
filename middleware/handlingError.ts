import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { CustomError } from '../helper/errors/custom_error';
import { PrismaKnownRequestError } from '../helper/errors/PrismaKnownRequestError';
import { PrismaValidationError } from '../helper/errors/PrismaValidationError';
import logger from '../helper/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
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


  if (err instanceof CustomError) {
    if (err.logger) {
      logger.error('[ERROR] CustomError: %o', { message: err.message, context: err.errors, request: request });
    }
    return res.status(err.statusCode).send({ type: "error", errors: err.errors });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    const prismaError = new PrismaKnownRequestError(err);
    if (prismaError.logger) {
      logger.error('[ERROR] PrismaError: %o', { message: prismaError.message, context: prismaError.errors, request: request });
    }
    return res.status(prismaError.statusCode).send({ type: "error", errors: prismaError.errors[0].context?.code });
  }

  if (err instanceof PrismaClientValidationError) {
    const prismaError = new PrismaValidationError(err);
    if (prismaError.logger) {
      logger.error('[ERROR] PrismaError: %o', { message: prismaError.message, context: prismaError.error.message, request: request });
    }
    return res.status(prismaError.statusCode).send({ type: "error", errors: prismaError.statusCode });
  }

  logger.error('[ERROR] UnknownError: %o', { error: err, request: request });
  res.status(500).send({ type: "error", errors: [{ message: err.message.length !== 0 ? err.message : 'Ada Kesalahan Backend' }] });
};