import supertest from "supertest";
import app from "../../app";
import env from "../../utils/env";

describe('POST /auth/login', () => {
    describe('Given right credentials', () => {
        it('Should return 202, token and user', async () => {
            const response = await supertest(app)
                .post('/auth/login')
                .send({
                    email: env.requireEnv('ADMIN_EMAIL') as string,
                    password: env.requireEnv('ADMIN_PASSWORD') as string
                })
            expect(response.body.token).toBeTruthy()
        })
    })
})