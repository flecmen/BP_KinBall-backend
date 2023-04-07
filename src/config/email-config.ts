import env from "../utils/env";

export default {
    transporter: {
        host: 'smtp.email.cz',
        port: 465,
        secure: true,
        auth: {
            user: env.requireEnv('EMAIL_SENDER'),
            pass: env.requireEnv('EMAIL_PASSWORD')
        }
    },

}