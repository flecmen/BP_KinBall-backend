import request from 'supertest';
import app from '../../app';
import Logger from '../../utils/logger';
import supertest = require('supertest');
import { UserOnEventStatus } from '@prisma/client';

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


describe('Create user reaction on event - PUT /:eventId/user/:userId/status/:userOnEventStatus/:boolValue', () => {
    describe('Creating reaction and given right credentials', () => {
        it('Should return 201 and updated event', async () => {
            const response = await supertest(app)
                .put(`/event/1/user/1/status/${UserOnEventStatus.going}/true`)
                .set('Authorization', 'Bearer ' + token)

            expect(response.body.players).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ userId: 1 })
                ])
            )
            expect(response.status).toBe(201)
        })
    })
    describe('Removing reaction and given right credentials', () => {
        it('Should return 201 and updated event', async () => {
            const response = await supertest(app)
                .put(`/event/1/user/1/status/${UserOnEventStatus.going}/false`)
                .set('Authorization', 'Bearer ' + token)

            expect(response.body.players).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ userId: 1 })
                ])
            )
            expect(response.status).toBe(201)
        })
    })
    describe('Giving wrong boolean', () => {
        it('Should return 400', async () => {
            const response = await supertest(app)
                .put(`/event/1/user/1/status/${UserOnEventStatus.going}/nejakystring`)
                .set('Authorization', 'Bearer ' + token)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Invalid boolValue value')
        })
    })
})

