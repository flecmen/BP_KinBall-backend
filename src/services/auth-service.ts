import { User } from '@prisma/client';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import Logger from '../utils/logger';

export default {
    generateToken(user: User) {
        const tokenPayload = {
            ...user
        };
        return jwt.sign(
            tokenPayload as object,
            config.jwtConfig.secret as Secret,
            {
                algorithm: config.jwtConfig.algorithms[0],
                expiresIn: config.jwtConfig.expirationTime,
            } as SignOptions,
        );
    },

    hashPassword(password: string) {
        return crypto.pbkdf2Sync(
            password,
            config.passwordConfig.salt as string,
            config.passwordConfig.iterations,
            config.passwordConfig.keylen,
            config.passwordConfig.digest
        ).toString(`hex`);
    }
}