import nodemailer from 'nodemailer';
import Email from 'email-templates';
import emailConfig from "../config/email-config";
import env from './env';
import { postType } from '@prisma/client';

export interface MailOptions {
    from?: string,
    to: string,
    subject: string,
}

export interface MailContentType {
    newAccountContent?: basicContent & NewAccountContent,
    newPostContent?: basicContent & NewPostContent,
}

export const MailTemplates = {
    newAccountTemplate: 'newAccountTemplate',
    newPostTemplate: 'newPostTemplate',
}

export const transporter = nodemailer.createTransport(emailConfig.transporter);

export const email = new Email({
    message: {
        from: emailConfig.transporter.auth.user,
    },
    views: { root: 'src/templates' }
})

interface basicContent {
    heading: string;
    text: string;
}

interface NewAccountContent {
    login: string;
    password: string;
}

interface NewPostContent {
    author: string;
    time_of_creation: Date;
    postHeading: string;
    postText: string;
    postType: postType;
}