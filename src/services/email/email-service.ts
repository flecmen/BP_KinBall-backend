import Logger from '../../utils/logger';
import { MailOptions, MailContentType, transporter, email } from '../../utils/email-utils';
import env from '../../utils/env';

export default {
    async sendMail(mailOptions: MailOptions, renderedEmail: string) {
        // Don't send emails in test environment
        if (env.requireEnv('NODE_ENV') === 'test' && env.requireEnv('NODE_ENV') === 'development') {
            Logger.info('Email not sent, because of test/dev environment');
        }
        mailOptions.from = env.requireEnv('EMAIL_SENDER') as string;

        if (renderedEmail !== '') {
            transporter.sendMail({ ...mailOptions, html: renderedEmail }, function (error, info) {
                if (error) {
                    Logger.error(`email-service.sendMail: ${error}`)
                } else {
                    Logger.info('Email sent: ' + info.response);
                }
            });
        }

    },
}
