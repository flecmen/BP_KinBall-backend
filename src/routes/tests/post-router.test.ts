import supertest from "supertest";
import app from "../../app";
import dotenv from 'dotenv'
import { Survey_option } from "@prisma/client";
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

describe('Creating a post', () => {
    describe('POST /post', () => {
        describe('Creating a text-type post', () => {
            describe('Given valid data', () => {
                it('Should return 201 and created post', async () => {
                    const response = await supertest(app)
                        .post('/post')
                        .send({
                            heading: 'Test post',
                            text: 'Test post text',
                            type: 'text',
                            author: { id: 1 },
                            groups: [{ id: 1 }],
                        })
                        .set('Authorization', 'Bearer ' + token)
                    expect(response.statusCode).toBe(201)
                    expect(response.body.type).toBe('text')
                    expect(response.body.heading).toBe('Test post')
                    expect(response.body.text).toBe('Test post text')
                })
            })

            describe('Given missing data', () => {
                describe('heading', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                text: 'Test post text',
                                type: 'text',
                                author: { id: 1 },
                                groups: [{ id: 1 }],
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                    })
                })
                describe('text', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                type: 'text',
                                author: { id: 1 },
                                groups: [{ id: 1 }],
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                    })
                })
                describe('type', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                text: 'Test post text',
                                author: { id: 1 },
                                groups: [{ id: 1 }],
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                    })
                })
                describe('author', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                text: 'Test post text',
                                type: 'text',
                                groups: [{ id: 1 }],
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                    })
                })
                describe('groups', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                text: 'Test post text',
                                type: 'text',
                                author: { id: 1 },
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                    })
                })
            })
        })
        describe('Creating a survey-type post', () => {
            describe('Given valid data', () => {
                it('Should return 201 and created post', async () => {
                    const response = await supertest(app)
                        .post('/post')
                        .send({
                            heading: 'Test post',
                            text: 'Test post text',
                            type: 'survey',
                            author: { id: 1 },
                            groups: [{ id: 1 }],
                            survey_options: [
                                { text: 'Otázka 1' },
                                { text: 'Otázka 2' },
                                { text: 'Otázka 3' },
                            ]
                        })
                        .set('Authorization', 'Bearer ' + token)
                    expect(response.statusCode).toBe(201)
                    expect(response.body.type).toBe('survey')
                    expect(response.body.heading).toBe('Test post')
                    expect(response.body.text).toBe('Test post text')
                    expect(response.body.survey_options).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ text: 'Otázka 1' }),
                            expect.objectContaining({ text: 'Otázka 2' }),
                            expect.objectContaining({ text: 'Otázka 3' }),
                        ])
                    )
                })
            })
            describe('Given missing data', () => {
                describe('empty survey_options', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                text: 'Test post text',
                                type: 'survey',
                                author: { id: 1 },
                                groups: [{ id: 1 }],
                                survey_options: [
                                ]
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                        expect(response.body.error).toBe('Missing survey options')
                    })
                })
                describe('missing survey_options', () => {
                    it('Should return 400 and error message', async () => {
                        const response = await supertest(app)
                            .post('/post')
                            .send({
                                heading: 'Test post',
                                text: 'Test post text',
                                type: 'survey',
                                author: { id: 1 },
                                groups: [{ id: 1 }],
                            })
                            .set('Authorization', 'Bearer ' + token)
                        expect(response.statusCode).toBe(400)
                        expect(response.body.error).toBe('Missing survey options')
                    })
                })
            })
        })
    })
})

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

describe('DELETE event', () => {
    describe('Given valid id', () => {
        it('should return 204', async () => {
            // first create a post to be deleted (it is already tested above)
            const post = await supertest(app)
                .post('/post')
                .send({
                    heading: 'Test post',
                    text: 'Test post text',
                    type: 'survey',
                    author: { id: 1 },
                    groups: [{ id: 1 }],
                    survey_options: [
                        { text: 'Otázka 1' },
                        { text: 'Otázka 2' },
                    ]
                })
                .set('Authorization', 'Bearer ' + token)

            const response = await supertest(app)
                .delete('/post/' + post.body.id)
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(204)

            const getDeltedPost = await supertest(app)
                .get('/' + post.body.id)
                .set('Authorization', 'Bearer ' + token)
            // check if the post is really deleted
            expect(getDeltedPost.statusCode).toBe(404)
        })
    })

    describe('Given invalid id', () => {
        it('should return 204', async () => {
            const response = await supertest(app)
                .delete('/post/999')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(204)
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

// Delete a post like
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
                .send({ text: "Test comment" })
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(201)
            expect(response.body.id).toBe(1)
            expect(response.body.text).toBe('Test comment')
        })
    })

    describe('Given a invalid post', () => {
        it('Should return 404', async () => {
            const response = await supertest(app)
                .post('/post/20/comment/1')
                .send({ text: "Invalid comment" })
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(404)
        })
    })
    describe('Given a invalid user', () => {
        it('Should return 404', async () => {
            const response = await supertest(app)
                .post('/post/1/comment/20')
                .send({ text: "Invalid comment" })
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(404)
        })
    })
    describe('Given an invalid body', () => {
        it('Should return 404', async () => {
            const response = await supertest(app)
                .post('/post/1/comment/1')
                .send({})
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(404)
        })
    })
    describe('Given an empty commentText', () => {
        it('Should return 404', async () => {
            const response = await supertest(app)
                .post('/post/1/comment/1')
                .send({ text: "" })
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(404)
        })
    })
})

// Liking POST comment
describe('POST /post/:postId/comment/:commentId/like/:userId', () => {
    describe('Given a valid post, comment and user', () => {
        it('Should return 201 and post_comment with added like', async () => {
            const response = await supertest(app)
                .post('/post/1/comment/1/like/1')
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

// Deleteing post comment like
describe('DELETE /post/:postId/comment/:commentId/like/:userId', () => {
    describe('Given an existing postId, commentId and userId', () => {
        describe('Given a really existing like', () => {
            it('should return 204', async () => {
                const response = await supertest(app)
                    .delete('/post/1/comment/1/like/1')
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
                    .delete('/post/1/comment/1/like/1')
                    .set('Authorization', 'Bearer ' + token)
                expect(response.statusCode).toBe(204)
            })
        })
    })
})

describe('DELETE /post/:postId/comment/:commentId', () => {
    describe('Given an existing post and commentId', () => {

        it('should return 204', async () => {
            const response = await supertest(app)
                .delete('/post/1/comment/1')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(204)

        })
    })

    describe('Given not existing post or commentId', () => {
        it('Should not crash', async () => {
            const response = await supertest(app)
                .delete('/post/20/comment/30')
                .set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(204)
        })
    })
})