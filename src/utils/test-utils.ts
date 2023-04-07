import supertest from 'supertest';
import app from '../app';
import env from './env';

export const getAdminAuthToken = async () => {
    // login as admin and get token
    const response = await supertest(app)
        .post('/auth/login')
        .send({
            email: env.requireEnv('ADMIN_EMAIL') as string,
            password: env.requireEnv('ADMIN_PASSWORD') as string
        });
    return response.body.token;
};