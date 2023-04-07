import app from '../../app';
import supertest from "supertest";
import { UserOnEventStatus, eventType } from '@prisma/client';
import { getAdminAuthToken } from '../../utils/test-utils';

let token: string;
beforeEach(async () => {
    token = await getAdminAuthToken();
});

describe('EVENT', () => {

    describe('GET multiple events', () => {
        describe('Given right credentials', () => {
            it('Should return 200 and array of events', async () => {
                const eventIds = [1, 2]
                const response = await supertest(app)
                    .get('/event/multiple')
                    .query({ idArray: eventIds.join(',') })
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(200)
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: 1 }),
                    expect.objectContaining({ id: 2 })
                ]))
            })
        })
    })

    describe('GET multiple events by postIds', () => {
        describe('Given right credentials', () => {
            it('Should return 200 and array of events', async () => {
                const postIds = [2, 3]
                const response = await supertest(app)
                    .get('/event/multiple/byPostIds')
                    .query({ idArray: postIds.join(',') })
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(200)
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: 1 }),
                    expect.objectContaining({ id: 2 })
                ]))
            })
        })
    })



    describe('Create event - POST /', () => {
        describe('Given right credentials', () => {
            it('Should return 201 and created event', async () => {
                const response = await supertest(app)
                    .post('/event')
                    .send({
                        description: 'Test description',
                        time: new Date(),
                        type: eventType.trenink,
                        groups: [{ id: 1 }],
                        organiser: { id: 1, full_name: 'David Flek' },
                        address: 'Hybešova 80, Brno',
                    })
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(201)
            })
        })
    })

    describe('DELETE', () => {
        describe('Given right credentials', () => {
            it('Should return 204', async () => {
                // first create an event we will be deleting (tested above)
                const event = await supertest(app)
                    .post('/event')
                    .send({
                        description: 'Test description',
                        time: new Date(),
                        type: eventType.trenink,
                        groups: [{ id: 1 }],
                        organiser: { id: 1, full_name: 'David Flek' },
                        address: 'Hybešova 80, Brno',
                    })
                    .set('Authorization', 'Bearer ' + token)
                const response = await supertest(app)
                    .delete('/event/' + event.body.id)
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(204)

                const deletedEvent = await supertest(app)
                    .get('/' + event.body.id)
                    .set('Authorization', 'Bearer ' + token)
                // is it really deleted?
                expect(deletedEvent.status).toBe(404)
            })
        })
        describe('Given non-existing credentials', () => {
            it('Should return 204 anyway', async () => {
                const response = await supertest(app)
                    .delete('/event/9999')
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(204)
            })
        })
    })


    describe('Create user reaction on event - PUT /:eventId/user/:userId/status/:userOnEventStatus/:boolValue', () => {
        describe('Creating reaction and given right credentials', () => {
            it('Should return 201 and updated event', async () => {
                const response = await supertest(app)
                    .post(`/event/1/user/1/status/${UserOnEventStatus.going}/true`)
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
                    .post(`/event/1/user/1/status/${UserOnEventStatus.going}/false`)
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
                    .post(`/event/1/user/1/status/${UserOnEventStatus.going}/nejakystring`)
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(400)
            })
        })
        describe('Giving wrong userOnEventStatus value', () => {
            it('Should return 400', async () => {
                const response = await supertest(app)
                    .post(`/event/1/user/1/status/not going/true`)
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(400)
                expect(response.body.error).toBe('Invalid userOnEventStatus value')
            })
        })
    })

})    
