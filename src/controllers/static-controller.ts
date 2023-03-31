import { Request, Response } from "express"
import path from "path";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default {
    getImage: async (req: Request, res: Response) => {
        const filename = req.params.filename;
        const imagePath = path.join('static/images', filename);
        const image = fs.readFileSync(imagePath);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(image, 'binary');
    },

    postImage: async (req: Request, res: Response) => {
        const filename = `${uuidv4()}.jpg`
        const imagePath = path.join(__dirname, 'images', filename);
        const image = req.body.image;
        fs.writeFileSync(imagePath, image);
        res.status(200).send(filename)
    },
}