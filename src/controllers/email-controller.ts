import emailService from "../services/email/email-service";
import { MailOptions, MailContent } from "../services/email/email-service";
import { User } from '@prisma/client';

export default {
    async sendNewAccountEmail(user: User) {
        const mailOptions: MailOptions = {
            to: user.email,
            subject: 'New Account'
        }
        const mailContent: MailContent = {
            name: user.full_name,
            heading: 'Log in credentials to Kin-Ball institute app',
            body: 'login: ' + user.email + ' password: ' + user.password + '\n Your password was randomly generated, please change it right after first login.'
        }
        emailService.sendMail(mailOptions, mailContent);
    }
}

