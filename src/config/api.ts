import env from "../utils/env";

const PORT = env.defaultEnv('PORT', '3000');
const FRONT_ROOT_URL = env.defaultEnv('FRONT_ROOT_URL', 'http://localhost:9000');
const FRONT_PWA_URL = env.defaultEnv('FRONT_PWA_URL', 'http://localhost:9200');
const API_ROOT_URL = env.defaultEnv('API_ROOT_URL', `http://localhost:${PORT}`);

export default {
    port: PORT,
    frontRootUrls: [FRONT_ROOT_URL, FRONT_PWA_URL],
    apiRootUrl: API_ROOT_URL
}