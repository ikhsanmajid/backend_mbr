import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAIL! as string,
        pass: process.env.PASS_MAIL! as string
    },
    tls: {
        rejectUnauthorized: false
    }
})