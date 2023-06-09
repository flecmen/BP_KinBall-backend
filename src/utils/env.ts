import dotenv from 'dotenv';
dotenv.config()

class MissingEnvironmentVariable extends Error { }

function requireEnv(varName: string): string | undefined {
    if (!(varName in process.env)) {
        throw new MissingEnvironmentVariable(`Missing required environment variable: ${varName}`);
    }
    return process.env[varName];
}


export default {
    requireEnv: requireEnv,
    defaultEnv: (varName: string, defaultValue: any): any => {
        try {
            return requireEnv(varName);
        } catch (e) {
            // Making sure other unexpected errors are not silenced
            if (e instanceof MissingEnvironmentVariable) {
                return defaultValue;
            }
            throw e;
        }
    }
}
