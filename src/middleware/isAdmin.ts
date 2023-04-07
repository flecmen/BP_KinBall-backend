import { User, role } from '@prisma/client';
import { NextFunction, Request, Response } from "express";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config';
import Logger from "../utils/logger";



function getDecodedTokenFromHeaders(req: Request): { userId: number, isAdmin: boolean, iat: string } | null {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token as string, jwtConfig.secret as jwt.Secret) as unknown

        return decoded as { userId: number, isAdmin: boolean, iat: string };
    }

    return null;
}
function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        Logger.debug('No token provided')
        return res.status(401).send('No token provided')
    }
    const token: User = req.user as User // Token is decoded to req.user from jwtVerify.ts
    if (token.role === role.admin) {
        return next();
    } else {
    }
}

export default isAdmin