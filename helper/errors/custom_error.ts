export type CustomErrorType = {
    message?: string,
    context?: { [key: string]: any }
}

export abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: CustomErrorType[];
    abstract readonly logger: boolean;

    constructor(message: string){
        super(message)

        Object.setPrototypeOf(this, CustomError.prototype)
    }
}