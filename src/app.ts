import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Logger from './lib/logger';
import morganMiddleware from './config/morganMiddleware'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morganMiddleware)

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    Logger.info(`Server is running at http://localhost:${port}`);
});