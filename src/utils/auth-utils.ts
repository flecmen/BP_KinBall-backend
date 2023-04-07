import { User } from '@prisma/client';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwtConfig, passwordConfig } from '../config';
import crypto from "crypto";

export default {
    generateToken(user: User) {
        const tokenPayload = {
            ...user
        };
        return jwt.sign(
            tokenPayload as object,
            jwtConfig.secret as Secret,
            {
                algorithm: jwtConfig.algorithms[0],
                expiresIn: jwtConfig.expirationTime,
            } as SignOptions,
        );
    },

    hashPassword(password: string) {
        return crypto.pbkdf2Sync(
            password,
            passwordConfig.salt as string,
            passwordConfig.iterations,
            passwordConfig.keylen,
            passwordConfig.digest
        ).toString(`hex`);
    }
}