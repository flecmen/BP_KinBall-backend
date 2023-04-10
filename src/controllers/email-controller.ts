import emailService from "../services/email/email-service";
import { MailOptions, MailContent } from "../utils/email-utils";
import { User } from '@prisma/client';
import env from "../utils/env";

export default {
    async sendNewAccountEmail(user: User) {
        const mailOptions: MailOptions = {
            to: user.email,
            subject: 'New Account'
        }
        const mailContent: MailContent = {
            newAccountContent: {
                full_name: user.full_name,
                heading: 'Log in credentials to Kin-Ball institute app',
                login: user.email,
                password: user.password,
                text: 'Your password was randomly generated, but please change it right after first login.'
            }
        }
        // Don't send emails in test environment
        if (env.requireEnv('NODE_ENV') !== 'test')
            emailService.sendMail(mailOptions, mailContent);

    }
}

