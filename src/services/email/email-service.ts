import Logger from '../../utils/logger';
import { MailOptions, MailContent, transporter, email } from '../../utils/email-utils';
import env from '../../utils/env';

export default {
    async sendMail(mailOptions: MailOptions, locals: MailContent) {
        mailOptions.from = env.requireEnv('EMAIL_SENDER') as string;
        let template = ''
        let renderedTemplate = ''

        if (locals.newAccountContent) {
            template = 'newAccountTemplate'
            renderedTemplate = await email.render(template, locals.newAccountContent);
        }

        if (template !== '' && renderedTemplate !== '') {
            transporter.sendMail({ ...mailOptions, html: renderedTemplate }, function (error, info) {
                if (error) {
                    Logger.error(`email-service.sendMail: ${error}`)
                } else {
                    Logger.info('Email sent: ' + info.response);
                }
            });
        }
    },
}
