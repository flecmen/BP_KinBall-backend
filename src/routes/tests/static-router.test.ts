import supertest from "supertest";
import app from "../../app";
import * as fs from 'fs';
import FormData from 'form-data'
import { Blob } from "buffer";
import { getAdminAuthToken } from '../../utils/test-utils';

let token: string;
beforeEach(async () => {
    token = await getAdminAuthToken();
});

const testImage = '337521251_1195016387844693_518157944899836968_n.jpg'
const testImageFile = fs.readFileSync('static/images/' + testImage)

describe('GET /static/image', () => {
    describe('Given a valid image name', () => {
        it('should return 200 and image', async () => {
            const response = await supertest(app)
                .get('/static/image/' + testImage)
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(testImageFile)
        })
    })
})

// nefunkční test
// describe('POST /static/image', () => {
//     describe('Given a valid image', () => {
//         it('should return 200 and image name', async () => {
//             const formData = new FormData()
//             const blob = new Blob([testImageFile], { type: 'image/png' })
//             formData.append('image', blob)
//             const response = await supertest(app).post('/static/image')
//                 .set('Authorization', 'Bearer ' + token)
//                 .set('Content-Type', 'multipart/form-data')
//                 .send(formData)
//             expect(response.status).toBe(200)
//             // test jestli je image opravdu na serveru
//             const serverImage = await supertest(app)
//                 .get('/static/image/' + response.body)
//                 .set('Authorization', 'Bearer ' + token)
//             expect(serverImage.body).toEqual(testImageFile)
//         })
//     })
// })