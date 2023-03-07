import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Logger from './utils/logger';
import morganMiddleware from './middleware/morganMiddleware'
import userRouter from './routes/user-router'
import authRouter from './routes/auth-router'
import swaggerDocs from './utils/swagger';
import jwtVerify from './middleware/jwtVerify';
import isAdmin from './middleware/isAdmin';

//uložení .env proměnných do process.env
dotenv.config();

const app: Express = express();

// Middleware
app.use(morganMiddleware) // Logger
app.use('/user', jwtVerify) // Check if JWT isn't expired
app.use('/user', jwtVerify)
app.use(express.json());
app.use('/user', isAdmin)

// Routery
app.use('/auth', authRouter)
app.use('/user', userRouter)
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