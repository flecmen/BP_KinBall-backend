import request from 'supertest';
import app from '../../app';
import Logger from '../../utils/logger';
import supertest = require('supertest');

let token: string;
beforeEach(async () => {
    // login as admin and get token
    const response = await supertest(app)
        .post('/auth/login')
        .send({
            email: process.env.ADMIN_EMAIL as string,
            password: process.env.ADMIN_PASSWORD as string
        })
    token = response.body.token; // store token
    Logger.debug(token)
});


describe('PUT /event/:eventId/addUser/:userId', () => {
    describe('Given right credentials', () => {
        it('Should return 201, token and user', async () => {
            const response = await supertest(app)
                .put('/event/1/addUser/1')

            expect(response.body.players).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ userId: 1 })
                ])
            )
            expect(response.status).toBe(201)
        })
    })
})

