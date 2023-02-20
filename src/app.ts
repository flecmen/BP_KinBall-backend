import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Logger from './utils/logger';
import morganMiddleware from './utils/morganMiddleware'
import userRouter from './routes/user-router'
import authRouter from './routes/auth-router'
import swaggerDocs from './utils/swagger';

//uložení .env proměnných do process.env
dotenv.config();

const app: Express = express();

app.use(morganMiddleware) // Logger
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/auth', authRouter)
app.use('/user', userRouter)


const port = process.env.PORT;

app.listen(port, () => {
    Logger.info(`Server is running at http://localhost:${port}`);
    const numberPort = parseInt(port as string)
    swaggerDocs(app, numberPort);
});