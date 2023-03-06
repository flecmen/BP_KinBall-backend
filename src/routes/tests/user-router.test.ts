import supertest from "supertest";
import app from "../../app";
import { role } from "@prisma/client";
import Logger from "../../utils/logger";
import dotenv from 'dotenv'
dotenv.config()
const mockUser = {
    full_name: 'Jane Smith',
    email: 'random@email.com',
    password: 'password456',
    role: role.trener,
    date_of_birth: new Date(1985, 10, 15),
    facebook: 'https://facebook.com/janesmith',
    instagram: 'https://instagram.com/janesmith',
}



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


describe('GET /', () => {

    it('Should return all users', async () => {
        const response = await supertest(app)
            .get('/user')
            .set('Authorization', 'Bearer ' + token)
        expect(response.status).toBe(200)
    })
})

describe('GET /:userId', () => {
    it('Should return a user', async () => {
        const response = await supertest(app).get('/user/1')
            .set('Authorization', 'Bearer ' + token)
        expect(response.status).toBe(200)
    })
    describe('Bad argument', () => {
        it('Should return 400', async () => {
            const response = await supertest(app).get('/user/nejaky_string')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(400)
        })
    })
    describe('Not existing user', () => {
        it('Should return 404', async () => {
            const response = await supertest(app).get('/user/9999')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(404)
        })
    })
})

describe('PUT /', () => {
    describe('Given a unique user', () => {
        it('Should return 201 and given user', async () => {
            const response = await supertest(app)
                .put('/user').send(mockUser)
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(201)
        })
    })
    describe('Given a used email address', () => {
        it('Should return 403', async () => {
            const response = await supertest(app)
                .put('/user')
                .send({
                    full_name: 'Jane Smith',
                    email: 'davidovkyflekovky@gmail.com',
                    password: 'password456',
                    role: role.trener,
                    date_of_birth: new Date(1985, 10, 15),
                    facebook: 'https://facebook.com/janesmith',
                    instagram: 'https://instagram.com/janesmith',
                })
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(403)
        })
    })
    describe('Given bad data', () => {
        it('Should return 403', async () => {
            const response = await supertest(app)
                .put('/user')
                .send({
                    full_name: 'Jane Smith',
                    password: 'password456',
                    role: role.trener,
                    date_of_birth: new Date(1985, 10, 15),
                    facebook: 'https://facebook.com/janesmith',
                    instagram: 'https://instagram.com/janesmith',
                })
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(403)
        })
    })
})

describe('PUT /:userId', () => {
    describe('Given a valid altered user', () => {
        it('Should return 200 and correct changes', async () => {
            const response = await supertest(app)
                .put('/user/4')
                .send({
                    full_name: 'Jane Sanchez',
                    email: 'random@email.com',
                    role: role.trener,
                    date_of_birth: new Date(1985, 10, 15),
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