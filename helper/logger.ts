import winston, { format } from "winston";
import path from 'path';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format: format.printf((info) => {
                const { level, message, stack } = info as { level: string; message: string; stack?: string };
                return stack ? `${level}: ${message}\n${stack}` : `${level}: ${message}`;
            }),
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/info.log'),
            level: 'info',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/warn.log'),
            level: 'warn',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),

        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 20
        })
    ],

    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
    ],

    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/rejections.log') })
    ]
});

export default logger;