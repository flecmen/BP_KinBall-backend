import env from "../utils/env";

// This is later used in prisma, let's error early
const db_url = env.requireEnv('DATABASE_URL')

export default {
    url: db_url
};