import express, { Request, Response } from 'express';
import jwtVerify from './middleware/jwtVerify';
import { authorizeRole } from './middleware/authorize';
import morganMiddleware from './middleware/morganMiddleware'
import userRouter from './routes/user-router'
import authRouter from './routes/auth-router'
import postRouter from './routes/post-router'
import groupRouter from './routes/group-router'
import staticRouter from './routes/static-router'
import eventRouter from './routes/event-router'
import { role } from '@prisma/client';


const router = express.Router();

// Middleware
router.use(morganMiddleware) // Logger
// jwt protected
router.use('/user', jwtVerify, userRouter)
router.use('/post', jwtVerify, postRouter)
router.use('/event', jwtVerify, eventRouter)
router.use('/group', jwtVerify, groupRouter)

// jwt unprotected
router.use('/auth', authRouter)
router.use('/static', staticRouter)
router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});


export default router;