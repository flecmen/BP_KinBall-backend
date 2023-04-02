import nodemailer from 'nodemailer';
import Email from 'email-templates';
import Logger from '../../utils/logger';

const transporter = nodemailer.createTransport({
    host: 'smtp.email.cz',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
});


export interface MailOptions {
    from?: string,
    to: string,
    subject: string,
}

export interface MailContent {
    name: string,
    heading: string,
    body: string,
}

const email = new Email({
    message: {
        from: process.env.EMAIL_SENDER,
    },
    views: { root: 'src/templates' }
})

const template = 'emailLayout'

export default {
    async sendMail(mailOptions: MailOptions, locals: MailContent) {
        mailOptions.from = process.env.EMAIL_SENDER as string;
        const new_mail = await email.render(template, locals)

        transporter.sendMail({ ...mailOptions, html: new_mail }, function (error, info) {
            if (error) {
                Logger.error(`email-service.sendMail: ${error}`)
            } else {
                Logger.info('Email sent: ' + info.response);
            }
        });
    },
}
