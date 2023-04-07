import nodemailer from 'nodemailer';
import Email from 'email-templates';
import emailConfig from "../config/email-config";
import env from './env';

export interface MailOptions {
    from?: string,
    to: string,
    subject: string,
}

export interface MailContent {
    newAccountContent?: basicContent & NewAccountContent,
}

export const transporter = nodemailer.createTransport(emailConfig.transporter);

export const email = new Email({
    message: {
        from: emailConfig.transporter.auth.user,
    },
    views: { root: 'src/templates' }
})

interface basicContent {
    full_name: string;
    heading: string;
    text: string;
}

interface NewAccountContent {
    login: string;
    password: string;
}