import { Request, Response } from "express"
import path from "path";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default {
    getImage: async (req: Request, res: Response) => {
        const filename = req.params.filename;
        if (filename === 'undefined') {
            return res.status(400).json({ error: 'Missing filename' })
        }
        const imagePath = path.join('static', 'images', filename);
        const image = fs.readFileSync(imagePath);
        // allow to cache the image for 1 day
        //res.setHeader('Cache-control', 'max-age=86400')
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(image, 'binary');
    },

    postImage: async (req: Request, res: Response) => {
        const filename = `${uuidv4()}.jpg`
        const imagePath = path.join('../../static/images', filename);
        const image = req.body.image;
        fs.writeFileSync(imagePath, image);
        res.status(200).send(filename)
    },
}