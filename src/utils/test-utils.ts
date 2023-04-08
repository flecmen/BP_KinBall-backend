import { Express } from 'express';
import supertest from 'supertest';
import app from '../app';
import env from './env';

export const getAdminAuthToken = async (app1: typeof app) => {
    // login as admin and get token
    const response = await supertest(app1)
        .post('/auth/login')
        .send({
            email: env.requireEnv('ADMIN_EMAIL') as string,
            password: env.requireEnv('ADMIN_PASSWORD') as string
        });
    return response.body.token;
};