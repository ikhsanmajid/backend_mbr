"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const path_1 = __importDefault(require("path"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.format.printf((info) => {
                const { level, message, stack } = info;
                return stack ? `${level}: ${message}\n${stack}` : `${level}: ${message}`;
            }),
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../logs/info.log'),
            level: 'info',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../logs/warn.log'),
            level: 'warn',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 10
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../logs/combined.log'),
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 20
        })
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(__dirname, '../logs/exceptions.log') })
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(__dirname, '../logs/rejections.log') })
    ]
});
exports.default = logger;
