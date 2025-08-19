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
        })]
});

export default logger;