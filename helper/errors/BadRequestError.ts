import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { CustomError, CustomErrorType} from "./custom_error";

export default class BadRequestError extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;
    private readonly _logger: boolean;
    private readonly _context: { [key: string]: any};

    constructor(params?: { statusCode?: number, message?: string, logger?: boolean, context?: { [key: string]: any } }){
        const { statusCode, message, logger} = params || {}
        super(message || "Bad Request")
        this._code = statusCode || BadRequestError._statusCode
        this._logger = logger || true
        this._context = params?.context || {}

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    get errors(): CustomErrorType[]{
        return [ { message: this.message, context: this._context} ]
    }

    get statusCode(): number{
        return this._code;
    }

    get logger(): boolean{
        return this._logger;
    }

    static fromPrismaError (error: PrismaClientKnownRequestError | PrismaClientValidationError, logger?: boolean){
        return new BadRequestError({
            statusCode: 400,
            message: error.message,
            logger,
            context: {
                code: 'code' in error ? error.code : "V001",
                name: error.name,
                meta: error instanceof PrismaClientKnownRequestError ? error.meta : null,
                stack: error.stack
            }
        })
    }
}