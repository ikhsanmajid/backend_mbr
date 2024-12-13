import { CustomError, CustomErrorType } from './custom_error';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

export class PrismaValidationError extends CustomError {
  statusCode = 400;
  logger = true;
  errors: CustomErrorType[];

  constructor(public error: PrismaClientValidationError) {
    super(error.message);
    this.errors = [{
      message: error.message,
      context: {
        stack: error.stack
      }
    }];

    Object.setPrototypeOf(this, PrismaValidationError.prototype);
  }
}