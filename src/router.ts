import express, { Request, Response } from 'express';
import jwtVerify from './middleware/jwtVerify';
import isAdmin from './middleware/isAdmin';
import morganMiddleware from './middleware/morganMiddleware'
import userRouter from './routes/user-router'
import authRouter from './routes/auth-router'
import postRouter from './routes/post-router'
import groupRouter from './routes/group-router'
import staticRouter from './routes/static-router'
import eventRouter from './routes/event-router'


const router = express.Router();

// Middleware
router.use(morganMiddleware) // Logger
router.use('/user', jwtVerify, isAdmin)
router.use('/post', jwtVerify, isAdmin)

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/event', eventRouter)
router.use('/group', groupRouter)
router.use('/static', staticRouter)
router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});


export default router;