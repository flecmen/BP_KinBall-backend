import emailService from "../services/email/email-service";
import { MailOptions, MailContentType, email, MailTemplates } from "../utils/email-utils";
import { Post, User } from '@prisma/client';
import env from "../utils/env";

export default {
    async sendNewAccountEmail(user: User) {
        const mailOptions: MailOptions = {
            to: user.email,
            subject: 'New Account'
        }
        const renderedEmail = await email.render(MailTemplates.newAccountTemplate, {
            heading: 'Log in credentials to Kin-Ball institute app',
            login: user.email,
            password: user.password,
            text: 'Your password was randomly generated, but please change it right after first login.'
        })
        emailService.sendMail(mailOptions, renderedEmail);
    },
    async sendNewPostEmailNotification(user: User[], subject: string, text: string, post: Post, authorFull_name: string) {
        const mailOptions: MailOptions = {
            to: user.join(';'),
            subject
        }
        const renderedEmail = await email.render(MailTemplates.newPostTemplate, {
            heding: 'Nový příspěvek od ' + authorFull_name,
            text,
            author: authorFull_name,
            time_of_creation: post.time_of_creation.getDay + '. ' + post.time_of_creation.getMonth + '. ' + post.time_of_creation.getFullYear + ' ' + post.time_of_creation.getHours + ':' + post.time_of_creation.getMinutes,
            postHeading: post.heading,
            postText: post.text,
            postType: post.type
        })
        emailService.sendMail(mailOptions, renderedEmail);
    }
}

