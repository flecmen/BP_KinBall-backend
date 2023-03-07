import { role } from '@prisma/client';
import { NextFunction, Request, Response } from "express";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';
import Logger from "../utils/logger";



function getDecodedTokenFromHeaders(req: Request): { userId: number, isAdmin: boolean, iat: string } | null {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token as string, config.jwtConfig.secret as jwt.Secret) as unknown

        return decoded as { userId: number, isAdmin: boolean, iat: string };
    }

    return null;
}
function isAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.user // Token is decoded in req.user from jwtVerify.ts
    if (!token) {
        Logger.debug('No token provided')
        return res.status(401).send('No token provided')
    };
    //TODO: přidat kontrolu admina
    if (true) {
        Logger.debug(token)
        return next();
    } else {
    }
}

export default isAdmin