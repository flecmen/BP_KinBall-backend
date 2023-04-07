import env from "../utils/env";

const JWT_SALT = env.requireEnv('JWT_SALT');

export default {
    salt: JWT_SALT,
    iterations: 1000,
    keylen: 64,
    digest: 'sha512',
}