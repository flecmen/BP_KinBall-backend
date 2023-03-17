import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Logger from './utils/logger';
import morganMiddleware from './middleware/morganMiddleware'
import userRouter from './routes/user-router'
import authRouter from './routes/auth-router'
import postRouter from './routes/post-router'
import swaggerDocs from './utils/swagger';
import jwtVerify from './middleware/jwtVerify';
import isAdmin from './middleware/isAdmin';
import cors from 'cors'
import config from './config';

//uložení .env proměnných do process.env
dotenv.config();

const app: Express = express();

app.use(express.json());

//Security
app.use(cors({ origin: config.FRONT_ROOT_URL }));

// Middleware
app.use(morganMiddleware) // Logger
app.use('/user', jwtVerify, isAdmin)
app.use('/post', jwtVerify, isAdmin)

// Routery
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

const port = process.env.PORT;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        Logger.info(`Server is running at http://localhost:${port}`);
        const numberPort = parseInt(port as string)
        swaggerDocs(app, numberPort);
    });
}

export default app;