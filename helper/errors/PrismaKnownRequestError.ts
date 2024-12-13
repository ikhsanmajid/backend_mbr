import { CustomError, CustomErrorType } from './custom_error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class PrismaKnownRequestError extends CustomError {
  statusCode = 400;
  logger = true;
  errors: CustomErrorType[];

  constructor(public error: PrismaClientKnownRequestError) {
    super(error.message);
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