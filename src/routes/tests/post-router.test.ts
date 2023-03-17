import supertest from "supertest";
import app from "../../app";
import dotenv from 'dotenv'
dotenv.config()

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
});

describe('GET /post/:postId', () => {
    describe('Given valid id', () => {
        it('should return 200', async () => {
            const response = await supertest(app)
                .get('/post/1')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(200)
            expect(response.body)
        })
    })
})

describe('POST /post/:postId/like/:userId', () => {
    describe('Given a valid post and valid user', () => {
        it('Should return 201 and post with added like', async () => {
            const response = await supertest(app)
                .post('/post/1/like/1')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(201)
            expect(response.body.likes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: 1 })
                ])
            )
        })
    })
})

describe('DELETE /:postId/like/useId', () => {
    describe('Given an existing post and userId', () => {
        describe('Given a really existing like', () => {
            it('should return 204', async () => {
                const response = await supertest(app)
                    .delete('/post/1/like/1')
                    .set('Authorization', 'Bearer ' + token)
                expect(response.statusCode).toBe(204)
                expect(response.body.likes).not.toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ id: 1 })
                    ])
                )
            })
        })
        describe('Given non-existing like', () => {
            it('Should return 204 anyway', async () => {
                const response = await supertest(app)
                    .delete('/post/1/like/1')
                    .set('Authorization', 'Bearer ' + token)
                expect(response.statusCode).toBe(204)
            })
        })
    })

    describe('Given not existing post or userId', () => {
        it('Should not crash', async () => {
            const response = await supertest(app)
                .delete('/post/20/like/30')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(204)
        })
    })
})

describe('POST /post/:postId/comment/:userId', () => {
    describe('Given a valid post and valid user', () => {
        it('Should return 201 and post with added comment', async () => {
            const response = await supertest(app)
                .post('/post/1/comment/1')
                .send('Test comment')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual(
                expect.objectContaining({ id: 1, text: 'Test comment' })
            )
        })
    })
})