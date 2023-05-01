import env from "../utils/env";
import { Params } from 'express-jwt';

const JWT_SECRET = env.requireEnv('JWT_SECRET');
const JWT_EXPIRATION_TIME = parseInt(env.defaultEnv('JWT_EXPIRATION_TIME', '7200'))

export default {
    secret: JWT_SECRET as Params['secret'],
    algorithms: ['HS256'] as Params['algorithms'],
    expirationTime: JWT_EXPIRATION_TIME,
}