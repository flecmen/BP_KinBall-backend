import { UserOnEventStatus, eventType } from '@prisma/client';
import supertest from "supertest";
import app from '../../app';
import { getAdminAuthToken } from '../../utils/test-utils';

let token: string;
beforeEach(async () => {
    token = await getAdminAuthToken(app);
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



    describe('Create event - POST /post', () => {
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

        describe('Creating a kurz_pro_mladez', () => {
            describe('Given right credentials', () => {
                it('Should return 201 and created event with all members of the group', async () => {
                    const group = await supertest(app)
                        .post('/group')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            name: 'Test kurz pro mladez',
                            color: '#000000',
                        })
                    expect(group.status).toBe(201)
                    expect(group.body.id).toBeTruthy()
                    const user1 = await supertest(app)
                        .post('/user')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            full_name: 'Kurz_pro_Mladez Test User 2',
                            email: 'kurz_pro_mladez@test1.com',
                            groups: [{ id: group.body.id }]
                        })
                    expect(user1.status).toBe(201)
                    const user2 = await supertest(app)
                        .post('/user')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            full_name: 'Kurz_pro_Mladez Test User 2',
                            email: 'kurz_pro_mladez@test2.com',
                            groups: [{ id: group.body.id }]
                        })
                    expect(user2.status).toBe(201)
                    const response = await supertest(app)
                        .post('/event')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            description: 'Test description',
                            time: new Date(),
                            type: eventType.kurz_pro_mladez,
                            groups: [{ id: group.body.id }],
                            organiser: { id: 1 },
                            address: 'Hybešova 80, Brno',
                        })
                    expect(response.status).toBe(201)
                    expect(response.body.players).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ userId: user1.body.id }),
                            expect.objectContaining({ userId: user2.body.id })
                        ])
                    )
                })
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


    describe('Create user reaction on event - POST /:eventId/user/:userId/status/:userOnEventStatus/:boolValue', () => {
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

        describe('Giving wrong credentials', () => {
            describe('Wrong boolean', () => {
                it('Should return 400', async () => {
                    const response = await supertest(app)
                        .post(`/event/1/user/1/status/${UserOnEventStatus.going}/nejakystring`)
                        .set('Authorization', 'Bearer ' + token)

                    expect(response.status).toBe(400)
                })
            })
            describe('Wrong userOnEventStatus value', () => {
                it('Should return 400', async () => {
                    const response = await supertest(app)
                        .post(`/event/1/user/1/status/not going/true`)
                        .set('Authorization', 'Bearer ' + token)

                    expect(response.status).toBe(400)
                    expect(response.body.error).toBe('Invalid userOnEventStatus value')
                })
            })
        })

        describe('Reacting on event after reaction_deadline', () => {
            it('Should return 400 and error message', async () => {
                const event = await supertest(app)
                    .post('/event')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        description: 'Test description',
                        time: new Date(),
                        type: eventType.trenink,
                        groups: [{ id: 1 }],
                        organiser: { id: 1, full_name: 'David Flek' },
                        address: 'Hybešova 80, Brno',
                        reaction_deadline: new Date('2021-01-01')
                    })
                const response = await supertest(app)
                    .post(`/event/${event.body.id}/user/1/status/${UserOnEventStatus.going}/true`)
                    .set('Authorization', 'Bearer ' + token)

                expect(response.status).toBe(400)
                expect(response.body.error).toBe('Reaction deadline has passed')
            })
        })
    })


    describe('Set attendance [POST /event/:eventId/attendance]', () => {
        describe('Given right credentials', () => {
            it('Should return 200 and updated event', async () => {
                const event = await supertest(app)
                    .post('/event')
                    .send({
                        description: 'Test training description',
                        time: new Date(),
                        type: eventType.trenink,
                        groups: [{ id: 1 }],
                        organiser: { id: 1, full_name: 'David Flek' },
                        address: 'Testovací 80, Brno',
                    })
                    .set('Authorization', 'Bearer ' + token)

                const userOE1 = await supertest(app)
                    .post(`/event/${event.body.id}/user/1/status/${UserOnEventStatus.going}/true`)
                    .set('Authorization', 'Bearer ' + token)

                const userOE2 = await supertest(app)
                    .post(`/event/${event.body.id}/user/2/status/${UserOnEventStatus.going}/true`)
                    .set('Authorization', 'Bearer ' + token)

                const response = await supertest(app)
                    .post(`/event/${event.body.id}/attendance`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        data: [
                            { userId: 1, present: true },
                            { userId: 2, present: false }
                        ]
                    })

                expect(response.body.players).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ userId: 1, present: true }),
                        expect.objectContaining({ userId: 2, present: false })
                    ])
                )
                expect(response.status).toBe(200)
            })
        })
    })

})    
