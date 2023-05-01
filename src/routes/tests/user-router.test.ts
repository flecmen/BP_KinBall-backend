import supertest from "supertest";
import app from "../../app";
import { role } from "@prisma/client";
import { getAdminAuthToken } from '../../utils/test-utils';
import env from "../../utils/env";

const mockUser = {
    full_name: 'Jane Smith',
    email: 'merunka47@post.cz',
    password: 'password456',
    role: role.coach,
    date_of_birth: new Date(1985, 10, 15),
    facebook: 'https://facebook.com/janesmith',
    instagram: 'https://instagram.com/janesmith',
}

let token: string;
beforeEach(async () => {
    token = await getAdminAuthToken(app);
});


describe('GET /', () => {
    it('Should return all users', async () => {
        const response = await supertest(app)
            .get('/user')
            .set('Authorization', 'Bearer ' + token)
        expect(response.status).toBe(200)
    })
})

describe('GET /:userId', () => {
    describe('Given existing user', () => {
        it('Should return 200 and a user', async () => {
            const response = await supertest(app).get('/user/1')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                full_name: 'David Flek',
            }))
        })
    })
    describe('Given bad argument', () => {
        it('Should return 400', async () => {
            const response = await supertest(app).get('/user/nejaky_string')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(400)
        })
    })
    describe('Given not existing user', () => {
        it('Should return 404', async () => {
            const response = await supertest(app).get('/user/9999')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(404)
        })
    })
})

describe('POST /user', () => {
    describe('Given a unique user', () => {
        it('Should return 201 and given user', async () => {
            const response = await supertest(app)
                .post('/user').send(mockUser)
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(201)
            expect(response.body).toEqual(expect.objectContaining({
                full_name: mockUser.full_name,
                email: mockUser.email,
                role: mockUser.role,
                date_of_birth: mockUser.date_of_birth.toISOString(),
                facebook: mockUser.facebook,
                instagram: mockUser.instagram,
            }))
        })
    })
    describe('Given a used email address', () => {
        it('Should return 403', async () => {
            const response = await supertest(app)
                .post('/user')
                .send({
                    full_name: 'Jane Smith',
                    email: env.requireEnv('ADMIN_EMAIL'),
                    role: role.coach,
                    date_of_birth: new Date(1985, 10, 15),
                    facebook: 'https://facebook.com/janesmith',
                    instagram: 'https://instagram.com/janesmith',
                })
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(403)
            expect(response.body).toEqual(expect.objectContaining({
                error: 'email taken',
            }))
        })
    })
    describe('Given data with missing email', () => {
        it('Should return 403', async () => {
            const response = await supertest(app)
                .post('/user')
                .send({
                    full_name: 'Jane Smith',
                    role: role.coach,
                    date_of_birth: new Date(1985, 10, 15),
                    facebook: 'https://facebook.com/janesmith',
                    instagram: 'https://instagram.com/janesmith',
                })
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(400)
            expect(response.body).toEqual(expect.objectContaining({
                error: 'email and full name are required',
            }))
        })
    })
})

describe('PUT /:userId', () => {
    describe('Given a valid altered user', () => {
        it('Should return 200 and correct changes', async () => {
            //First, get a user
            const user = await supertest(app)
                .get('/user/5')
                .set('Authorization', 'Bearer ' + token)

            const response = await supertest(app)
                .put(`/user/${user.body.id}`)
                .send({
                    full_name: 'Jane Sanchez',
                    facebook: 'https://facebook.com/janeSanchez',
                    instagram: 'https://instagram.com/janesmith',
                })
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(200)
            expect(response.body.full_name).toBe('Jane Sanchez')
            expect(response.body.facebook).toBe('https://facebook.com/janeSanchez')
        })

    })
})