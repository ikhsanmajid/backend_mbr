"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILER_URL,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL
    },
    secure: false,
    requireTLS: true,
    tls: {
        servername: process.env.MAILER_URL
    }
});
