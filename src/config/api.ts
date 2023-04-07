import env from "../utils/env";

const PORT = env.defaultEnv('PORT', '3000');
const FRONT_ROOT_URL = env.defaultEnv('FRONT_ROOT_URL', 'http://localhost:9000');
const API_ROOT_URL = env.defaultEnv('API_ROOT_URL', `http://localhost:${PORT}`);

export default {
    port: PORT,
    frontRootUrl: FRONT_ROOT_URL,
    apiRootUrl: API_ROOT_URL
}