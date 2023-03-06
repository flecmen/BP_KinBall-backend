import supertest from "supertest";
import app from "../../app";
import dotenv from 'dotenv'
dotenv.config()



describe('POST /auth/login', () => {
    describe('Given right credentials', () => {
        it('Should return 202, token and user', async () => {
            const response = await supertest(app)
                .post('/auth/login')
                .send({
                    email: process.env.ADMIN_EMAIL as string,
                    password: process.env.ADMIN_PASSWORD as string
                })
            expect(response.body.token).toBeTruthy()
        })
    })
})