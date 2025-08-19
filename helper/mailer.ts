import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
    host: process.env.MAILER_URL! as string,
    port: process.env.MAILER_PORT! as unknown as number,
    auth: {
        user: process.env.USER_MAIL! as string,
        pass: process.env.PASSWORD_MAIL! as string
    },
    secure: false,
    requireTLS: true,
    tls: {
        servername: process.env.MAILER_URL! as string
    }
})
